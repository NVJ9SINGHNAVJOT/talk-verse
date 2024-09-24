package config

import (
	"fmt"
	"os"
	"strconv"
)

type environmentConfig struct {
	ENVIRONMENT         string
	MONGODB_URL         string
	KAFKA_GROUP_WORKERS int
	KAFKA_GROUP_ID      string
	KAFKA_BROKERS       string
}

var Envs = environmentConfig{}

func ValidateEnvs() error {

	environment, exist := os.LookupEnv("ENVIRONMENT")
	if !exist {
		return fmt.Errorf("environment is not provided")
	}

	mongoDBUrl, exist := os.LookupEnv("MONGODB_URL")
	if !exist {
		return fmt.Errorf("mongo db url is not provided")
	}

	kafkaGroupWorkersStr, exist := os.LookupEnv("KAFKA_GROUP_WORKERS")
	if !exist {
		return fmt.Errorf("kafka group workers is not provided")
	}

	kafkaGroupWorkers, err := strconv.Atoi(kafkaGroupWorkersStr)
	if err != nil {
		return fmt.Errorf("invalid kafka group workers size: %v", err)
	}

	if kafkaGroupWorkers < 1 {
		return fmt.Errorf("minimum size required for kafkaGroupWorkers is 1")
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
	Envs.MONGODB_URL = mongoDBUrl
	Envs.KAFKA_GROUP_WORKERS = kafkaGroupWorkers
	Envs.KAFKA_GROUP_ID = kafkaGroupId
	Envs.KAFKA_BROKERS = kafkaBrokers

	return nil
}
