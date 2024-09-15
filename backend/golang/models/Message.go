package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Message struct for MongoDB document
type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UUID      string             `bson:"uuid" json:"uuid"`
	IsFile    bool               `bson:"isFile" json:"isFile"`
	ChatID    primitive.ObjectID `bson:"chatId" json:"chatId"`
	From      primitive.ObjectID `bson:"from" json:"from"`
	To        primitive.ObjectID `bson:"to" json:"to"`
	FromText  string             `bson:"fromText" json:"fromText"`
	ToText    string             `bson:"toText" json:"toText"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}
