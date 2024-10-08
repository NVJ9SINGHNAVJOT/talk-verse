#!/bin/bash

# Source the file containing the container status functions
source ./docker_container_status.sh

# Check if the container name and network name are provided as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <container_name> <network_name>"
    exit 1
fi

# Function to manage Kafka container
manage_kafka_container() {
    local container_name="$1"          # Local variable for container name
    local network_name="$2"            # Local variable for network name
    local volume_name="kafka-data-development-${container_name}"  # Local variable for unique volume name

    # Check if the Kafka container exists
    if does_container_exist "$container_name"; then
        # Check if the container is running
        if is_container_running "$container_name"; then
            echo "Kafka container '$container_name' is already running."
        else
            echo "Kafka container '$container_name' exists but is not running. Starting the container..."
            docker start "$container_name"
        fi
    else
        # If the container doesn't exist, create and run the container
        echo "Kafka container '$container_name' does not exist. Creating and running the container..."
        docker run -d \
            --name "$container_name" \
            --hostname "$container_name" \
            --network "$network_name" \
            -p 9092:9092 \
            -v "$volume_name:/bitnami/kafka" \
            -e KAFKA_KRAFT_CLUSTER_ID=eWr0VGANOXqQHIvQLPE5ug \
            -e KAFKA_ENABLE_KRAFT=yes \
            -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
            -e KAFKA_CFG_NODE_ID=0 \
            -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@localhost:9093 \
            -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
            -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
            -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
            -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
            -e KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
            -e ALLOW_PLAINTEXT_LISTENER=yes \
            docker.io/bitnami/kafka:latest
    fi
}

# Call the function with the provided container name and network name
manage_kafka_container "$1" "$2"
