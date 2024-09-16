#!/bin/bash

# Kafka container name
KAFKA_CONTAINER="talkverse-kafka-development"

# Function to check if the container exists
does_container_exist() {
    docker inspect --type container "$KAFKA_CONTAINER" > /dev/null 2>&1
}

# Function to check if the container is running
is_container_running() {
    local container_name=$1
    # Get the container's status using inspect and check if it's running
    local status=$(docker inspect -f '{{.State.Status}}' "$container_name" 2>/dev/null)
    
    if [ "$status" == "running" ]; then
        return 0 # True (running)
    else
        return 1 # False (not running)
    fi
}

# Check if the Kafka container exists
if does_container_exist; then
    # Check if the container is running
    if is_container_running "$KAFKA_CONTAINER"; then
        echo "Kafka container '$KAFKA_CONTAINER' is already running."
    else
        echo "Kafka container '$KAFKA_CONTAINER' exists but is not running. Starting the container..."
        docker start $KAFKA_CONTAINER
    fi
else
    # If the container doesn't exist, create and run the container
    echo "Kafka container '$KAFKA_CONTAINER' does not exist. Creating and running the container..."
    docker run -d \
      --name $KAFKA_CONTAINER \
      --hostname $KAFKA_CONTAINER \
      --network proxy \
      -p 9092:9092 \
      -v talkverse-kafka_data-development:/bitnami/kafka \
      -e KAFKA_KRAFT_CLUSTER_ID=Mk7v7VBISdb098NSDVisdg \
      -e KAFKA_ENABLE_KRAFT=yes \
      -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
      -e KAFKA_CFG_NODE_ID=1 \
      -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
      -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
      -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
      -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
      -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
      -e KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
      -e ALLOW_PLAINTEXT_LISTENER=yes \
      docker.io/bitnami/kafka:3.3.2
fi

# Print the status of the Kafka container
docker ps -f name=$KAFKA_CONTAINER
