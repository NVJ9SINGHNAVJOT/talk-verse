package kafka

import (
	"context"
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
	case "gp-message":
		// Handle "gp-message" topic
		customErrMsg, err = handleGpMessageTopic(msg.Value)
	case "unseen-count":
		// Handle "unseen-count" topic
		customErrMsg, err = handleUnseenCountTopic(msg.Value)
	default:
		// Log a warning for unknown topics
		log.Warn().
			Str("worker", workerName).
			Interface("message_details", map[string]interface{}{
				"topic":         msg.Topic,
				"partition":     msg.Partition,
				"offset":        msg.Offset,
				"highWaterMark": msg.HighWaterMark,
				"value":         string(msg.Value),
				"time":          msg.Time,
			}).
			Msg("Unknown topic")
		return
	}

	// If an error occurred, log the error along with context details
	if err != nil {
		log.Error().
			Err(err).
			Str("worker", workerName).
			Interface("message_details", map[string]interface{}{
				"topic":         msg.Topic,
				"partition":     msg.Partition,
				"offset":        msg.Offset,
				"highWaterMark": msg.HighWaterMark,
				"value":         string(msg.Value),
				"time":          msg.Time,
			}).
			Msg(customErrMsg)
	}
}

// handleMessageTopic processes messages from the "message" topic
func handleMessageTopic(message []byte) (string, error) {
	var data kafkaMessageData

	// Unmarshal and Validate the incoming message into KafkaMessageData struct
	msg, err := helper.UnmarshalAndValidate(message, &data)
	if err != nil {
		return msg + " KafkaMessageData", err
	}

	// Set default value for IsFile if it's not present in the message
	if data.IsFile == nil {
		defaultIsFile := false
		data.IsFile = &defaultIsFile
	}

	// Create a new Message object to be inserted into MongoDB
	newMessage := models.Message{
		UUID:      data.UUID,
		ChatID:    data.ChatID, // Stored as a string in MongoDB
		From:      data.From,   // Stored as a string in MongoDB
		To:        data.To,     // Stored as a string in MongoDB
		FromText:  data.FromText,
		ToText:    data.ToText,
		CreatedAt: data.CreatedAt,
		UpdatedAt: time.Now(),
		IsFile:    *data.IsFile, // Dereference IsFile pointer
	}

	// Insert the new message into the "messages" collection in MongoDB
	collection := db.GetCollection("messages")
	_, err = collection.InsertOne(context.Background(), newMessage)
	if err != nil {
		return "Failed to insert Message into MongoDB", err
	}

	return "", nil // No error occurred
}

// handleGpMessageTopic processes messages from the "gp-message" topic
func handleGpMessageTopic(message []byte) (string, error) {
	var data kafkaGpMessageData

	// Unmarshal and Validate the incoming message into KafkaGpMessageData struct
	msg, err := helper.UnmarshalAndValidate(message, &data)
	if err != nil {
		return msg + " KafkaGpMessageData", err
	}

	// Set default value for IsFile if it's not present in the message
	if data.IsFile == nil {
		defaultIsFile := false
		data.IsFile = &defaultIsFile
	}

	// Create a new GpMessage object to be inserted into MongoDB
	newGpMessage := models.GpMessage{
		UUID:      data.UUID,
		IsFile:    *data.IsFile, // Dereference IsFile pointer
		From:      data.From,    // Stored as a string in MongoDB
		To:        data.To,      // Stored as a string in MongoDB
		Text:      data.Text,
		CreatedAt: data.CreatedAt,
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

// handleUnseenCountTopic processes messages from the "unseen-count" topic
func handleUnseenCountTopic(message []byte) (string, error) {
	var data kafkaUnseenCountData

	// Unmarshal and Validate the incoming message into KafkaUnseenCountData struct
	if msg, err := helper.UnmarshalAndValidate(message, &data); err != nil {
		return msg + " KafkaUnseenCountData", err
	}

	// Access the "unseencounts" collection from the MongoDB database
	collection := db.GetCollection("unseencounts")

	// Define the filter to find documents where the "mainId" matches the provided data.MainID
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
