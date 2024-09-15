package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GpMessage struct for MongoDB document
type GpMessage struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UUID      string             `bson:"uuId" json:"uuId" validate:"required"`
	IsFile    bool               `bson:"isFile" json:"isFile,omitempty"`
	From      primitive.ObjectID `bson:"from" json:"from" validate:"required"`
	To        primitive.ObjectID `bson:"to" json:"to" validate:"required"`
	Text      string             `bson:"text" json:"text" validate:"required"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt" validate:"required"`
}
