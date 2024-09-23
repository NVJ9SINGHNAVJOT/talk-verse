package kafka

import (
	"context"
	"encoding/json"
	"time"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/db"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/helper"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/models"
	"github.com/rs/zerolog/log"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// CommonBase defines the shared fields between different message types
type commonBase struct {
	UUID      string    `json:"uuId" validate:"required"`
	IsFile    *bool     `json:"isFile"`
	From      string    `json:"from" validate:"required"`
	CreatedAt time.Time `json:"createdAt" validate:"required"`
}

// KafkaMessage struct represents the structure of the message from Kafka
type kafkaMessageData struct {
	commonBase
	ChatID   string `json:"chatId" validate:"required"`
	FromText string `json:"fromText" validate:"required"`
	ToText   string `json:"toText" validate:"required"`
	To       string `json:"to" validate:"required"`
}

// KafkaGpMessage represents the structure of the Kafka message for group messages
type kafkaGpMessageData struct {
	commonBase
	To   string `json:"to" validate:"required"`
	Text string `json:"text" validate:"required"`
}

// UnseenCountData represents the structure of the unseen count Kafka message
type kafkaUnseenCountData struct {
	UserIDs []string `json:"userIds" validate:"required"`
	MainID  string   `json:"mainId" validate:"required"`
	Count   *int     `json:"count,omitempty"`
}

// ProcessMessage processes individual Kafka messages based on the topic
func ProcessMessage(msg kafka.Message, workerName string) {
	var err error
	var customErrMsg string

	// Process message based on the topic
	switch msg.Topic {
	case "message":
		// Handle "message" topic
		customErrMsg, err = handleMessageTopic(msg.Value)
	case "gpMessage":
		// Handle "gpMessage" topic
		customErrMsg, err = handleGpMessageTopic(msg.Value)
	case "unseenCount":
		// Handle "unseenCount" topic
		customErrMsg, err = handleUnseenCountTopic(msg.Value)
	default:
		// Log a warning for unknown topics
		log.Warn().Msgf("Unknown topic: %s, value: %s", msg.Topic, string(msg.Value))
		return
	}

	// If an error occurred, log the error along with context details
	if err != nil {
		log.Error().
			Err(err).
			Str("topic", msg.Topic).
			Int("partition", msg.Partition).
			Str("worker", workerName).
			Str("kafka_message", string(msg.Value)).
			Msg(customErrMsg)
	}
}

// handleMessageTopic processes messages from the "message" topic
func handleMessageTopic(message []byte) (string, error) {
	var msg kafkaMessageData

	// Unmarshal the incoming message into KafkaMessageData struct
	err := json.Unmarshal(message, &msg)
	if err != nil {
		return "Failed to unmarshal message", err
	}

	// Validate the unmarshaled message data
	if err := helper.ValidateStruct(msg); err != nil {
		return "Validation failed for KafkaMessageData", err
	}

	// Set default value for IsFile if it's not present in the message
	if msg.IsFile == nil {
		defaultIsFile := false
		msg.IsFile = &defaultIsFile
	}

	// Create a new Message object to be inserted into MongoDB
	newMessage := models.Message{
		UUID:      msg.UUID,
		ChatID:    msg.ChatID, // Stored as a string in MongoDB
		From:      msg.From,   // Stored as a string in MongoDB
		To:        msg.To,     // Stored as a string in MongoDB
		FromText:  msg.FromText,
		ToText:    msg.ToText,
		CreatedAt: msg.CreatedAt,
		UpdatedAt: time.Now(),
		IsFile:    *msg.IsFile, // Dereference IsFile pointer
	}

	// Insert the new message into the "messages" collection in MongoDB
	collection := db.GetCollection("messages")
	_, err = collection.InsertOne(context.Background(), newMessage)
	if err != nil {
		return "Failed to insert Message into MongoDB", err
	}

	return "", nil // No error occurred
}

// handleGpMessageTopic processes messages from the "gpMessage" topic
func handleGpMessageTopic(message []byte) (string, error) {
	var msg kafkaGpMessageData

	// Unmarshal the incoming message into KafkaGpMessageData struct
	err := json.Unmarshal(message, &msg)
	if err != nil {
		return "Failed to unmarshal message", err
	}

	// Validate the unmarshaled group message data
	if err := helper.ValidateStruct(msg); err != nil {
		return "Validation failed for KafkaGpMessageData", err
	}

	// Set default value for IsFile if it's not present in the message
	if msg.IsFile == nil {
		defaultIsFile := false
		msg.IsFile = &defaultIsFile
	}

	// Create a new GpMessage object to be inserted into MongoDB
	newGpMessage := models.GpMessage{
		UUID:      msg.UUID,
		IsFile:    *msg.IsFile, // Dereference IsFile pointer
		From:      msg.From,    // Stored as a string in MongoDB
		To:        msg.To,      // Stored as a string in MongoDB
		Text:      msg.Text,
		CreatedAt: msg.CreatedAt,
		UpdatedAt: time.Now(),
	}

	// Insert the new group message into the "gpmessages" collection in MongoDB
	collection := db.GetCollection("gpmessages")
	_, err = collection.InsertOne(context.Background(), newGpMessage)
	if err != nil {
		return "Failed to insert GpMessage into MongoDB", err
	}

	return "", nil // No error occurred
}

// handleUnseenCountTopic processes messages from the "unseenCount" topic
func handleUnseenCountTopic(message []byte) (string, error) {
	var data kafkaUnseenCountData

	// Unmarshal the incoming message into KafkaUnseenCountData struct
	if err := json.Unmarshal(message, &data); err != nil {
		return "Failed to unmarshal message", err
	}

	// Validate the unmarshaled unseen count data
	if err := helper.ValidateStruct(data); err != nil {
		return "Validation failed for KafkaUnseenCountData", err
	}

	// Define MongoDB collection and filter
	collection := db.GetCollection("unseencounts")
	filter := bson.M{"mainId": data.MainID}

	// Prepare update operation for unseen counts
	update := bson.M{"$set": bson.M{"updatedAt": time.Now()}}
	if data.Count != nil {
		update["$set"].(bson.M)["count"] = *data.Count
	} else {
		update["$inc"] = bson.M{"count": 1} // Increment count if not provided
	}

	// Update unseen count for a single user or multiple users
	if len(data.UserIDs) == 1 {
		// Update for a single user
		filter["userId"] = data.UserIDs[0]
		_, err := collection.UpdateOne(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			return "Failed to update UnseenCount for a single user", err
		}
	} else {
		// Update for multiple users
		filter["userId"] = bson.M{"$in": data.UserIDs}
		_, err := collection.UpdateMany(context.Background(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			return "Failed to update UnseenCount for multiple users", err
		}
	}

	return "", nil // No error occurred
}
