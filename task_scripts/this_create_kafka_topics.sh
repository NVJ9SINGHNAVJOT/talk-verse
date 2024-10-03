#!/bin/bash

# Source the file containing the container status and Kafka topic management functions
source ./task_scripts/docker_container_status.sh
source ./task_scripts/manage_kafka_topics.sh

# Check if the container name and replication factor are provided as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <container_name> <replication_factor (1 or 3)>"
    exit 1
fi

KAFKA_CONTAINER="$1"   # Local variable for container name
REPLICATION_FACTOR="$2" # Local variable for replication factor

# Validate replication factor (must be 1 or 3)
if [ "$REPLICATION_FACTOR" -ne 1 ] && [ "$REPLICATION_FACTOR" -ne 3 ]; then
    echo "Error: Replication factor must be either 1 or 3."
    exit 1
fi

# Check if Kafka container is running
if ! is_container_running "$KAFKA_CONTAINER"; then
    echo "Error: Kafka container '$KAFKA_CONTAINER' is not running."
    exit 1
fi

# NOTE: Kafka topic partitions can be scaled based on traffic and available system resources.
# Array of topics with their partition values
declare -A topics_and_partitions=(
    ["message"]=20
    ["gpMessage"]=20
    ["unseenCount"]=20
)

# Override defaults with environment variable values if they exist
for topic in "${!topics_and_partitions[@]}"; do
    env_var_name=$(echo "${topic^^}_PARTITIONS")  # Convert topic name to uppercase and append '_PARTITIONS'
    if [[ ! -z "${!env_var_name}" ]]; then  # Check if the environment variable is set and not empty
        topics_and_partitions[$topic]="${!env_var_name}"  # Use the value from the environment variable
        echo "Using environment variable for topic '$topic': ${env_var_name}=${topics_and_partitions[$topic]}"  # Log the env var value
    else
        echo "Using default value for topic '$topic': ${topics_and_partitions[$topic]}"  # Log the default value
    fi
done

# Wait for Kafka to be ready
wait_for_kafka_ready "$KAFKA_CONTAINER"

# Loop through the topics and create them with the specified partitions and replication factor
for topic in "${!topics_and_partitions[@]}"; do
    partitions="${topics_and_partitions[$topic]}"
    create_topic_if_not_exists "$KAFKA_CONTAINER" "$topic" "$partitions" "$REPLICATION_FACTOR"
done

echo "All specified topics have been created successfully."
