package config

import (
	"fmt"
	"os"
)

type EnvironmentConfig struct {
	ENVIRONMENT         string
	PORT                string
	SERVER_KEY          string
	MONGODB_URL         string
	KAFKA_GROUP_WORKERS string
	KAFKA_GROUP_ID      string
	KAFKA_BROKERS       string
}

var Envs = EnvironmentConfig{}

func ValidateEnvs() error {

	environment, exist := os.LookupEnv("ENVIRONMENT")
	if !exist {
		return fmt.Errorf("environment is not provided")
	}

	port, exist := os.LookupEnv("PORT")
	if !exist {
		return fmt.Errorf("port number is not provided")
	}

	serverKey, exist := os.LookupEnv("SERVER_KEY")
	if !exist {
		return fmt.Errorf("server key is not provided")
	}

	mongoDBUrl, exist := os.LookupEnv("MONGODB_URL")
	if !exist {
		return fmt.Errorf("mongo db url is not provided")
	}

	kafkaGroupWorkers, exist := os.LookupEnv("KAFKA_GROUP_WORKERS")
	if !exist {
		return fmt.Errorf("kafka group workers is not provided")
	}

	kafkaGroupId, exist := os.LookupEnv("KAFKA_GROUP_ID")
	if !exist {
		return fmt.Errorf("kafka group id is not provided")
	}

	kafkaBrokers, exist := os.LookupEnv("KAFKA_BROKERS")
	if !exist {
		return fmt.Errorf("kafka brokers is not provided")
	}

	Envs.ENVIRONMENT = environment
	Envs.PORT = port
	Envs.SERVER_KEY = serverKey
	Envs.MONGODB_URL = mongoDBUrl
	Envs.KAFKA_GROUP_WORKERS = kafkaGroupWorkers
	Envs.KAFKA_GROUP_ID = kafkaGroupId
	Envs.KAFKA_BROKERS = kafkaBrokers

	return nil
}
