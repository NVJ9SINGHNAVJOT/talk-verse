package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Message struct for MongoDB document
type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UUID      string             `bson:"uuId" json:"uuId" validate:"required"`
	IsFile    bool               `bson:"isFile" json:"isFile,omitempty"`
	ChatID    primitive.ObjectID `bson:"chatId" json:"chatId" validate:"required"`
	From      primitive.ObjectID `bson:"from" json:"from" validate:"required"`
	To        primitive.ObjectID `bson:"to" json:"to" validate:"required"`
	FromText  string             `bson:"fromText" json:"fromText" validate:"required"`
	ToText    string             `bson:"toText" json:"toText" validate:"required"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
