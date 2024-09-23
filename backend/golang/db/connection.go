package db

import (
	"context"
	"strings"
	"time"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

// Global MongoDB client and database
var (
	mongoClient   *mongo.Client
	mongoDatabase *mongo.Database
)

func ConnectMongoDB() error {

	client, err := mongo.Connect(options.Client().ApplyURI(config.Envs.MONGODB_URL))
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return err
	}
	// Assign the client to the global MongoClient variable
	mongoClient = client

	// Set the global MongoDatabase using your preferred database name
	database := strings.Split(config.Envs.MONGODB_URL, "/")
	mongoDatabase = client.Database(database[len(database)-1])

	return nil
}

func DisconnectMongoDB() error {
	return mongoClient.Disconnect(context.Background())
}

// GetCollection is a helper function to retrieve a collection from the global MongoDatabase
func GetCollection(collectionName string) *mongo.Collection {
	return mongoDatabase.Collection(collectionName)
}
