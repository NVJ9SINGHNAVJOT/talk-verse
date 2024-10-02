#!/bin/bash

# Kafka broker configuration
BROKER="localhost:9092"
TIMEOUT=30  # Maximum wait time for Kafka to be ready (in seconds)
SLEEP_INTERVAL=2  # Time to wait between each Kafka readiness check (in seconds)

# Function to check if Kafka is ready and wait for it to be ready if not
wait_for_kafka_ready() {
    local container_name="$1"
    local elapsed=0

    # Exit if no container name is given
    if [ -z "$container_name" ]; then
        echo "Error: No container name provided."
        exit 1
    fi

    # Wait until Kafka is ready or until the timeout is reached
    while [ "$elapsed" -lt "$TIMEOUT" ]; do
        # Try to list topics to verify if Kafka is responsive
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list >/dev/null 2>&1; then
            echo "Kafka is ready. Proceeding to actions..."
            return 0  # Kafka is ready
        else
            echo "Waiting for Kafka to be ready... (elapsed time: $elapsed seconds)"
            sleep "$SLEEP_INTERVAL"
            elapsed=$((elapsed + SLEEP_INTERVAL))
        fi
    done

    # If Kafka doesn't become ready in time, exit with an error
    echo "Error: Timed out waiting for Kafka to be ready."
    exit 1
}

# Function to delete a topic if it exists
delete_topic_if_exists() {
    local container_name="$1"
    local topic_name="$2"

    # Exit if no container or topic name is given
    if [ -z "$container_name" ] || [ -z "$topic_name" ]; then
        echo "Error: Container name and topic name must be provided."
        exit 1
    fi

    # Check if the topic exists
    if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list | grep -qw "$topic_name"; then
        echo "Deleting topic: $topic_name"
        # Attempt to delete the topic
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --delete --topic "$topic_name"; then
            echo "Topic '$topic_name' deleted."
        else
            echo "Error: Failed to delete topic '$topic_name'. Exiting..."
            exit 1  # Exit if the topic deletion fails
        fi
    else
        echo "Error: Topic '$topic_name' does not exist. Exiting..."
        exit 1  # Exit if the topic doesn't exist
    fi
}

# Function to create a topic if it doesn't exist
create_topic_if_not_exists() {
    local container_name="$1"
    local topic_name="$2"
    local partitions="$3"
    local replication_factor="$4"

    # Exit if no container, topic name, partitions, or replication factor is given
    if [ -z "$container_name" ] || [ -z "$topic_name" ] || [ -z "$partitions" ] || [ -z "$replication_factor" ]; then
        echo "Error: Container name, topic name, partitions, and replication factor must be provided."
        exit 1
    fi

    # Check if the topic already exists
    if ! docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list | grep -qw "$topic_name"; then
        echo "Creating topic: $topic_name"
        # Attempt to create the topic with specified partitions and replication factor
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --create \
            --topic "$topic_name" --partitions "$partitions" --replication-factor "$replication_factor"; then
            echo "Topic '$topic_name' created with $partitions partitions and replication factor of $replication_factor."
        else
            echo "Error: Failed to create topic '$topic_name'. Exiting..."
            exit 1  # Exit if the topic creation fails
        fi
    else
        echo "Topic '$topic_name' already exists."  # Topic already exists, no need to create
    fi
}

# Function to increase the number of partitions for a given topic
increase_partitions() {
    local container_name="$1"
    local topic_name="$2"
    local new_partitions="$3"

    # Exit if no container, topic name, or new partitions count is given
    if [ -z "$container_name" ] || [ -z "$topic_name" ] || [ -z "$new_partitions" ]; then
        echo "Error: Container name, topic name, and new partitions count must be provided."
        exit 1
    fi

    # Check if the topic exists
    if ! docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list | grep -qw "$topic_name"; then
        echo "Error: Topic '$topic_name' does not exist. Exiting..."
        exit 1  # Exit the script if the topic doesn't exist
    fi

    # Get the current number of partitions
    local current_partitions
    current_partitions=$(docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --describe --topic "$topic_name" | grep "Partitions:" | awk '{print $2}')

    if [ "$current_partitions" -lt "$new_partitions" ]; then
        echo "Increasing partitions for topic '$topic_name' from $current_partitions to $new_partitions."
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --alter \
            --topic "$topic_name" --partitions "$new_partitions"; then
            echo "Successfully increased partitions for topic '$topic_name'."
        else
            echo "Error: Failed to increase partitions for topic '$topic_name'. Exiting..."
            exit 1  # Exit the script on failure
        fi
    else
        echo "No need to increase partitions for topic '$topic_name'; current partitions: $current_partitions, requested: $new_partitions."
    fi
}
