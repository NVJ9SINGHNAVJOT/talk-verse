#!/bin/bash

source ./logging.sh

# Kafka broker configuration
BROKER="localhost:9092"
TIMEOUT=30  # Maximum wait time for Kafka to be ready (in seconds)
SLEEP_INTERVAL=2  # Time to wait between each Kafka readiness check (in seconds)

# Function to check if Kafka is ready and wait for it to be ready if not
wait_for_kafka_ready() {
    local container_name="$1"
    local elapsed=0

    if [ -z "$container_name" ]; then
        logerr "No container name provided."
        exit 1
    fi

    while [ "$elapsed" -lt "$TIMEOUT" ]; do
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list >/dev/null 2>&1; then
            loginf "Kafka is ready. Proceeding to actions..."
            return 0
        else
            loginf "Waiting for Kafka to be ready... (elapsed time: $elapsed seconds)"
            sleep "$SLEEP_INTERVAL"
            elapsed=$((elapsed + SLEEP_INTERVAL))
        fi
    done

    logerr "Timed out waiting for Kafka to be ready."
    exit 1
}

# Function to check if a topic exists
topic_exists() {
    local container_name="$1"
    local topic_name="$2"

    if [ -z "$container_name" ] || [ -z "$topic_name" ]; then
        logerr "Container name and topic name must be provided."
        exit 1
    fi

    if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --list | grep -qw "$topic_name"; then
        return 0
    else
        return 1
    fi
}

# Function to delete a topic if it exists
delete_topic_if_exists() {
    local container_name="$1"
    local topic_name="$2"

    if [ -z "$container_name" ] || [ -z "$topic_name" ]; then
        logerr "Container name and topic name must be provided."
        exit 1
    fi

    if topic_exists "$container_name" "$topic_name"; then
        loginf "Deleting topic: $topic_name"
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --delete --topic "$topic_name"; then
            loginf "Topic '$topic_name' deleted."
        else
            logerr "Failed to delete topic '$topic_name'."
            exit 1
        fi
    else
        logerr "Topic '$topic_name' does not exist."
        exit 1
    fi
}

# Function to create a topic if it doesn't exist
create_topic_if_not_exists() {
    local container_name="$1"
    local topic_name="$2"
    local partitions="$3"
    local replication_factor="$4"

    if [ -z "$container_name" ] || [ -z "$topic_name" ] || [ -z "$partitions" ] || [ -z "$replication_factor" ]; then
        logerr "Container name, topic name, partitions, and replication factor must be provided."
        exit 1
    fi

    if ! topic_exists "$container_name" "$topic_name"; then
        loginf "Creating topic: $topic_name"
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --create \
            --topic "$topic_name" --partitions "$partitions" --replication-factor "$replication_factor"; then
            loginf "Topic '$topic_name' created with $partitions partitions and replication factor of $replication_factor."
        else
            logerr "Failed to create topic '$topic_name'."
            exit 1
        fi
    else
        loginf "Topic '$topic_name' already exists."
    fi
}

# Function to increase the number of partitions for a given topic
increase_partitions() {
    local container_name="$1"
    local topic_name="$2"
    local new_partitions="$3"

    if [ -z "$container_name" ] || [ -z "$topic_name" ] || [ -z "$new_partitions" ]; then
        logerr "Container name, topic name, and new partitions count must be provided."
        exit 1
    fi

    if ! topic_exists "$container_name" "$topic_name"; then
        logerr "Topic '$topic_name' does not exist."
        exit 1
    fi

    local current_partitions
    current_partitions=$(docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --describe --topic "$topic_name" | grep "Partitions:" | awk '{print $2}')

    if [ "$current_partitions" -lt "$new_partitions" ]; then
        loginf "Increasing partitions for topic '$topic_name' from $current_partitions to $new_partitions."
        if docker exec "$container_name" kafka-topics.sh --bootstrap-server "$BROKER" --alter \
            --topic "$topic_name" --partitions "$new_partitions"; then
            loginf "Successfully increased partitions for topic '$topic_name'."
        else
            logerr "Failed to increase partitions for topic '$topic_name'."
            exit 1
        fi
    else
        loginf "No need to increase partitions for topic '$topic_name'; current partitions: $current_partitions, requested: $new_partitions."
    fi
}
