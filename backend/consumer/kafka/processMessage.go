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

// DLQMessage defines the structure of the message sent to the Dead-Letter Queue (DLQ).
type DLQMessage struct {
	OriginalTopic  string    `json:"originalTopic" validate:"required"`  // The original topic where the message came from
	Partition      int       `json:"partition" validate:"required"`      // Kafka partition of the original message
	Offset         int64     `json:"offset" validate:"required"`         // Offset of the original message
	HighWaterMark  int64     `json:"highWaterMark" validate:"required"`  // High watermark of the Kafka partition
	Value          string    `json:"value" validate:"required"`          // The original message value as a string
	ErrorDetails   string    `json:"errorDetails" validate:"required"`   // Details about the error encountered
	ProcessingTime time.Time `json:"processingTime" validate:"required"` // The timestamp when the message was processed
	ErrorTime      time.Time `json:"errorTime" validate:"required"`      // The timestamp when the error occurred
	Worker         string    `json:"worker" validate:"required"`         // The worker that processed the message
	CustomMessage  string    `json:"customMessage" validate:"required"`  // Any additional custom message
}

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

		// NOTE: Failed messages are sent to the topic: "talkverse-failed-letter-queue".
		// This helps in further processing of failed messages and reduces retry load
		// in the main consumption service.
		//
		// Create a new DLQMessage struct with the error details and original message information.
		dlqMessage := DLQMessage{
			OriginalTopic:  msg.Topic,         // The original topic where the message came from
			Partition:      msg.Partition,     // The partition number of the original message
			Offset:         msg.Offset,        // The offset of the original message
			HighWaterMark:  msg.HighWaterMark, // The high watermark of the Kafka partition
			Value:          string(msg.Value), // The original message value in string format
			ErrorDetails:   err.Error(),       // Error details encountered during processing
			ProcessingTime: msg.Time,          // The original timestamp when the message was processed
			ErrorTime:      time.Now(),        // The current timestamp when the error occurred
			Worker:         workerName,        // The worker responsible for processing the message
			CustomMessage:  customErrMsg,      // Any additional custom error message
		}

		// TODO: Implement specific processing for failed messages in this project.
		//
		// Attempt to produce the DLQ message to the "talkverse-failed-letter-queue" topic.
		err = Produce("talkverse-failed-letter-queue", dlqMessage)
		if err != nil {
			log.Error().
				Err(err).
				Str("worker", workerName).
				Interface("dlqMessage", dlqMessage).
				Msg("Error producing message to talkverse-failed-letter-queue")
		}
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
