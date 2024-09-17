#!/bin/bash

# Check if container name is passed as argument
if [ -z "$1" ]; then
  echo "Container name not provided"
  exit 1
fi

# Kafka container name from docker-compose
KAFKA_CONTAINER=$1
BROKER="localhost:9092"

# Function to check if the container is running
is_container_running() {
    # Get the container's status using inspect and check if it's running
    local status=$(docker inspect -f '{{.State.Status}}' "$KAFKA_CONTAINER" 2>/dev/null)
    
    if [ "$status" == "running" ]; then
        return 0 # True (running)
    else
        return 1 # False (not running)
    fi
}

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

# Check if the Kafka container is running
if is_container_running; then
  echo "Kafka container '$KAFKA_CONTAINER' is running. Proceeding to create topics..."

  # Create topics with 10 partitions and replication factor of 1
  create_topic_if_not_exists "message" 10 1
  create_topic_if_not_exists "gpMessage" 10 1
  create_topic_if_not_exists "unseenCount" 10 1
else
  echo "Kafka container '$KAFKA_CONTAINER' is not running. Exiting..."
  exit 1
fi
