package db

import (
	"context"
	"strings"
	"time"

	"github.com/nvj9singhnavjot/talkverse-server-kafka/config"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

// Global MongoDB client and database
var (
	MongoClient   *mongo.Client
	MongoDatabase *mongo.Database
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
	MongoClient = client

	// Set the global MongoDatabase using your preferred database name
	database := strings.Split(config.Envs.MONGODB_URL, "/")
	MongoDatabase = client.Database(database[len(database)-1])

	log.Info().Msg("mongoDB connected")

	return nil
}

func DisconnectMongoDB() {
	if err := MongoClient.Disconnect(context.Background()); err != nil {
		log.Error().Err(err).Msg("failed to disconnect mongodb client")
	}
}

// GetCollection is a helper function to retrieve a collection from the global MongoDatabase
func GetCollection(collectionName string) *mongo.Collection {
	return MongoDatabase.Collection(collectionName)
}
