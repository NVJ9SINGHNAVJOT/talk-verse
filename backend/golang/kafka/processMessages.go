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
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// processMessage processes individual Kafka messages
func ProcessMessage(msg kafka.Message, workerName string) {
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

// KafkaMessage struct represents the structure of the message from Kafka
type KafkaMessage struct {
	UUID      string    `json:"uuId" validate:"required"`
	ChatID    string    `json:"chatId" validate:"required"`
	From      string    `json:"from" validate:"required"`
	To        string    `json:"to" validate:"required"`
	FromText  string    `json:"fromText" validate:"required"`
	ToText    string    `json:"toText" validate:"required"`
	CreatedAt time.Time `json:"createdAt" validate:"required"`
	IsFile    *bool     `json:"isFile"` // Optional field, pointer to allow nil values
}

func handleMessageTopic(message []byte, workerName string) {
	var msg KafkaMessage

	// Unmarshal the Kafka message into the struct
	err := json.Unmarshal(message, &msg)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to unmarshal message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	// Validate the Kafka message struct
	if err := helper.ValidateStruct(msg); err != nil {
		log.Error().Err(err).Msgf("Validation failed for Kafka message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	// Default value for IsFile if not present
	if msg.IsFile == nil {
		defaultIsFile := false
		msg.IsFile = &defaultIsFile
	}

	// Create the Message struct for MongoDB
	newMessage := models.Message{
		UUID:      msg.UUID,
		ChatID:    msg.ChatID, // Stored as string
		From:      msg.From,   // Stored as string
		To:        msg.To,     // Stored as string
		FromText:  msg.FromText,
		ToText:    msg.ToText,
		CreatedAt: msg.CreatedAt,
		UpdatedAt: time.Now(),
		IsFile:    *msg.IsFile, // Dereference to get the value
	}

	// Insert the message into the MongoDB collection
	collection := db.GetCollection("messages")
	_, err = collection.InsertOne(context.Background(), newMessage)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to insert message into MongoDB. Worker: %s, Message: %s", workerName, string(message))
		return
	}
}

// KafkaGpMessage represents the structure of the Kafka message for group messages
type KafkaGpMessage struct {
	UUID      string    `json:"uuId" validate:"required"`
	IsFile    *bool     `json:"isFile"`
	From      string    `json:"from" validate:"required"`
	To        string    `json:"to" validate:"required"`
	Text      string    `json:"text" validate:"required"`
	CreatedAt time.Time `json:"createdAt" validate:"required"`
}

func handleGpMessageTopic(message []byte, workerName string) {
	var msg KafkaGpMessage

	// Unmarshal the Kafka message into the KafkaGpMessage struct
	err := json.Unmarshal(message, &msg)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to unmarshal group message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	// Validate the Kafka group message struct
	if err := helper.ValidateStruct(msg); err != nil {
		log.Error().Err(err).Msgf("Validation failed for Kafka group message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	// Default value for IsFile if not present
	if msg.IsFile == nil {
		defaultIsFile := false
		msg.IsFile = &defaultIsFile
	}

	// Create the GpMessage struct for MongoDB
	newGpMessage := models.GpMessage{
		UUID:      msg.UUID,
		IsFile:    *msg.IsFile, // Dereference the pointer to use the value
		From:      msg.From,    // Stored as string
		To:        msg.To,      // Stored as string
		Text:      msg.Text,
		CreatedAt: msg.CreatedAt,
		UpdatedAt: time.Now(),
	}

	// Insert the group message into the MongoDB "gpmessages" collection
	collection := db.GetCollection("gpmessages")
	_, err = collection.InsertOne(context.Background(), newGpMessage)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to insert group message into MongoDB. Worker: %s, Message: %s", workerName, string(message))
		return
	}
}

// UnseenCountData represents the structure of the unseen count Kafka message
type UnseenCountData struct {
	UserIDs []string `json:"userIds" validate:"required"`
	MainID  string   `json:"mainId" validate:"required"`
	Count   *int     `json:"count,omitempty"`
}

// handleUnseenCountTopic processes the "unseenCount" topic
func handleUnseenCountTopic(message []byte, workerName string) {
	var data UnseenCountData

	// Unmarshal the message
	if err := json.Unmarshal(message, &data); err != nil {
		log.Error().Err(err).Msgf("Failed to unmarshal unseenCount message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	// Validate the data struct
	if err := helper.ValidateStruct(data); err != nil {
		log.Error().Err(err).Msgf("Validation failed for unseenCount message. Worker: %s, Message: %s", workerName, string(message))
		return
	}

	collection := db.GetCollection("unseencounts")

	// Define the filter and update operation
	filter := bson.M{"mainId": data.MainID}
	update := bson.M{"$set": bson.M{"updatedAt": time.Now()}}
	if data.Count != nil {
		update["$set"].(bson.M)["count"] = *data.Count
	} else {
		update["$inc"] = bson.M{"count": 1}
	}

	// Update one document if there's only one user ID, otherwise update many
	if len(data.UserIDs) == 1 {
		filter["userId"] = data.UserIDs[0]
		_, err := collection.UpdateOne(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Error().Err(err).Msgf("Failed to update unseen count for a single user. Worker: %s, Message: %s", workerName, string(message))
		}
	} else {
		filter["userId"] = bson.M{"$in": data.UserIDs}
		_, err := collection.UpdateMany(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Error().Err(err).Msgf("Failed to update unseen counts for multiple users. Worker: %s, Message: %s", workerName, string(message))
		}
	}
}
