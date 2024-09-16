#!/bin/bash

# Kafka container name from docker-compose
KAFKA_CONTAINER="talkverse-kafka-development"
BROKER="localhost:9092"

# Function to create a topic if it doesn't exist
create_topic_if_not_exists() {
  TOPIC_NAME=$1
  PARTITIONS=$2
  REPLICATION_FACTOR=$3

  # Check if the topic exists
  if ! docker exec $KAFKA_CONTAINER kafka-topics.sh --bootstrap-server $BROKER --list | grep -w $TOPIC_NAME; then
    echo "Creating topic: $TOPIC_NAME"
    docker exec $KAFKA_CONTAINER kafka-topics.sh --bootstrap-server $BROKER --create --topic $TOPIC_NAME --partitions $PARTITIONS --replication-factor $REPLICATION_FACTOR
    echo "Topic '$TOPIC_NAME' created with $PARTITIONS partitions and replication factor of $REPLICATION_FACTOR"
  else
    echo "Topic '$TOPIC_NAME' already exists"
  fi
}

# Create topics with 10 partitions and replication factor of 1
create_topic_if_not_exists "message" 10 1
create_topic_if_not_exists "gpMessage" 10 1
create_topic_if_not_exists "unseenCount" 10 1
