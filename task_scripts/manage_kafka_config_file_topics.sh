#!/bin/bash

# Source the file containing the container status and Kafka topic management functions
source ./docker_container_status.sh
source ./manage_kafka_topics.sh

# Function to print usage instructions
usage() {
    echo "Usage: $0 <container_name> <config_file> <action> [replication_factor|new_partitions]"
    echo "Actions: create, increase, delete"
    echo "For 'create', provide replication_factor (1 or 3)"
    echo "For 'increase', provide new_partitions count"
    exit 1
}

# Check if at least three arguments are provided
if [ $# -lt 3 ]; then
    usage
fi

# Assign variables
KAFKA_CONTAINER="$1"
CONFIG_FILE="$2"
ACTION="$3"
REPLICATION_FACTOR="$4"
NEW_PARTITIONS="$4"  # Used in case of 'increase'

# Check if the configuration file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Configuration file '$CONFIG_FILE' not found."
    exit 1
fi

# Source the configuration file
source "$CONFIG_FILE"

# Validate action and ensure required parameters are provided
case "$ACTION" in
    "create")
        if [ -z "$REPLICATION_FACTOR" ] || ( [ "$REPLICATION_FACTOR" -ne 1 ] && [ "$REPLICATION_FACTOR" -ne 3 ] ); then
            echo "Error: For 'create', replication factor must be provided and must be either 1 or 3."
            exit 1
        fi
        ;;
    "increase")
        if [ -z "$NEW_PARTITIONS" ]; then
            echo "Error: For 'increase', new partitions count must be provided."
            exit 1
        fi
        ;;
    "delete")
        if [ -n "$4" ]; then  # Check if an extra 4th parameter is provided
            echo "Error: No additional parameters should be provided for 'delete' action."
            exit 1
        fi
        ;;
    *)
        echo "Error: Invalid action '$ACTION'. Action must be 'create', 'increase', or 'delete'."
        usage
        ;;
esac

# Check if Kafka container is running
if ! is_container_running "$KAFKA_CONTAINER"; then
    echo "Error: Kafka container '$KAFKA_CONTAINER' is not running."
    exit 1
fi

# Wait for Kafka to be ready
wait_for_kafka_ready "$KAFKA_CONTAINER"

# Function to validate if topics and partitions are set in the configuration file
validate_topic_config() {
    # Check if the array size is zero
    if [ ${#topics_and_partitions[@]} -eq 0 ]; then
        echo "Error: No topics found in the configuration file."
        exit 1
    fi

    for topic in "${!topics_and_partitions[@]}"; do
        partitions="${topics_and_partitions[$topic]}"

        # Check if topic or partition value is missing
        if [ -z "$topic" ] || [ -z "$partitions" ]; then
            echo "Error: Topic name or partition count missing in configuration for topic '$topic'."
            exit 1
        fi

        # Check if partition is a valid number greater than zero and does not start with leading zeros
        if ! [[ "$partitions" =~ ^[1-9][0-9]*$ ]]; then
            echo "Error: Partition count for topic '$topic' must be a valid number, greater than zero, and should not start with a leading zero."
            exit 1
        fi

        # Print the topic and partition value
        echo "Topic: $topic, Partitions: $partitions"
    done
}

# Validate the topics and partitions configuration
validate_topic_config

# Execute the requested action
case "$ACTION" in
    "create")
        # Loop through the topics and create them
        for topic in "${!topics_and_partitions[@]}"; do
            partitions="${topics_and_partitions[$topic]}"
            create_topic_if_not_exists "$KAFKA_CONTAINER" "$topic" "$partitions" "$REPLICATION_FACTOR"
        done
        echo "All topics created successfully."
        ;;
    "increase")
        # Loop through the topics and increase partitions
        for topic in "${!topics_and_partitions[@]}"; do
            increase_partitions "$KAFKA_CONTAINER" "$topic" "$NEW_PARTITIONS"
        done
        echo "Partitions increased successfully for all topics."
        ;;
    "delete")
        # Loop through the topics and delete them
        for topic in "${!topics_and_partitions[@]}"; do
            delete_topic_if_exists "$KAFKA_CONTAINER" "$topic"
        done
        echo "All topics deleted successfully."
        ;;
esac
