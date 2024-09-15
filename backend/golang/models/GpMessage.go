package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GroupMessage struct for MongoDB document
type GpMessage struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UUID      string             `bson:"uuid" json:"uuid"`
	IsFile    bool               `bson:"isFile" json:"isFile"`
	From      primitive.ObjectID `bson:"from" json:"from"`
	To        primitive.ObjectID `bson:"to" json:"to"`
	Text      string             `bson:"text" json:"text"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}
