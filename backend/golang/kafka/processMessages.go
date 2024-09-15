package kafka

import (
	"context"
	"encoding/json"
	"time"

	"github.com/nvj9singhnavjot/talkverse-server-kafka/db"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/helper"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/models"
	"github.com/rs/zerolog/log"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// processMessage processes individual Kafka messages
func ProcessMessage(msg kafka.Message, workerName string) {
	log.Debug().
		Str("worker", workerName).
		Int("partition", msg.Partition).
		Msgf("Received message: %s", string(msg.Value))
	// Process message based on topic
	switch msg.Topic {
	case "message":
		handleMessageTopic(msg.Value, workerName)
	case "gpMessage":
		handleGpMessageTopic(msg.Value, workerName)
	case "unseenCount":
		handleUnseenCountTopic(msg.Value, workerName)
	default:
		log.Warn().Msgf("Unknown topic: %s, value: %s", msg.Topic, string(msg.Value))
	}
}

// handleMessageTopic processes the "message" topic
func handleMessageTopic(message []byte, workerName string) {
	var msg models.Message

	// Unmarshal the Kafka message into the Message struct
	err := json.Unmarshal(message, &msg)
	if err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to unmarshal message")
		return
	}

	// Validate the message struct
	if err := helper.ValidateStruct(msg); err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Validation failed for message")
		return
	}

	// Directly assign default value
	if !msg.IsFile {
		msg.IsFile = false // This is redundant but shown for clarity
	}

	// Set timestamps
	msg.UpdatedAt = time.Now()

	// Insert the message into the MongoDB "messages" collection
	collection := db.GetCollection("messages")
	_, err = collection.InsertOne(context.Background(), msg)
	if err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to insert message into MongoDB")
		return
	}

	log.Info().Str("worker", workerName).Msgf("Successfully inserted message with UUID: %s", msg.UUID)
}

// handleGpMessageTopic processes the "gpMessage" topic
func handleGpMessageTopic(message []byte, workerName string) {
	var gpMsg models.GpMessage

	// Unmarshal the Kafka message into the GpMessage struct
	err := json.Unmarshal(message, &gpMsg)
	if err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to unmarshal group message")
		return
	}

	// Validate the group message struct
	if err := helper.ValidateStruct(gpMsg); err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Validation failed for group message")
		return
	}

	// Directly assign default value
	if !gpMsg.IsFile {
		gpMsg.IsFile = false // This is redundant but shown for clarity
	}

	// Set timestamps
	gpMsg.UpdatedAt = time.Now()

	// Insert the group message into the MongoDB "gpmessages" collection
	collection := db.GetCollection("gpmessages")
	_, err = collection.InsertOne(context.Background(), gpMsg)
	if err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to insert group message into MongoDB")
		return
	}

	log.Info().Str("worker", workerName).Msgf("Successfully inserted group message with UUID: %s", gpMsg.UUID)
}

// handleUnseenCountTopic processes the "unseenCount" topic
func handleUnseenCountTopic(message []byte, workerName string) {
	// Unmarshal the message
	var data struct {
		UserIDs []string `json:"userIds"`
		MainID  string   `json:"mainId"`
		Count   *int     `json:"count,omitempty"`
	}

	// Unmarshal the message
	if err := json.Unmarshal(message, &data); err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to unmarshal unseenCount message")
		return
	}

	collection := db.GetCollection("unseencounts")
	mainID, err := primitive.ObjectIDFromHex(data.MainID)
	if err != nil {
		log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Invalid MainID format")
		return
	}

	// Convert user IDs to ObjectIDs
	userIDs := make([]primitive.ObjectID, len(data.UserIDs))
	for i, userIDStr := range data.UserIDs {
		userID, err := primitive.ObjectIDFromHex(userIDStr)
		if err != nil {
			log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Invalid UserID format")
			return
		}
		userIDs[i] = userID
	}

	// Define the filter and update operation
	filter := bson.M{"mainId": mainID}
	update := bson.M{"$set": bson.M{"updatedAt": time.Now()}}
	if data.Count != nil {
		update["$set"].(bson.M)["count"] = *data.Count
	} else {
		update["$inc"] = bson.M{"count": 1}
	}

	// Update one document if there's only one user ID, otherwise update many
	if len(userIDs) == 1 {
		filter["userId"] = userIDs[0]
		_, err = collection.UpdateOne(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to update unseen count for a single user")
		}
	} else {
		filter["userId"] = bson.M{"$in": userIDs}
		_, err = collection.UpdateMany(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Error().Err(err).Str("worker", workerName).Str("message", string(message)).Msg("Failed to update unseen counts for multiple users")
		}
	}
}
