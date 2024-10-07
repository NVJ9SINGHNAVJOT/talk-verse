package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// UnseenCount represents the unseen count document in MongoDB
type UnseenCount struct {
	UserID    primitive.ObjectID `bson:"userId" json:"userId" validate:"required"`
	MainID    primitive.ObjectID `bson:"mainId" json:"mainId" validate:"required"`
	Count     int                `bson:"count" json:"count" validate:"required,gte=0"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt" validate:"required"`
}
