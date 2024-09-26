#!/bin/bash

# Check if the container name is provided as an argument
if [ -z "$1" ]; then
	echo "Error: Container name not provided."
	exit 1
fi

# Assigning Kafka container name from the argument
KAFKA_CONTAINER="$1"
BROKER="localhost:9092"
TIMEOUT=30  # Maximum wait time in seconds
SLEEP_INTERVAL=2  # Sleep interval in seconds

# Function to check if the container is running
is_container_running() {
	local status
	status=$(docker inspect -f '{{.State.Status}}' "$KAFKA_CONTAINER" 2>/dev/null)

	if [ "$status" == "running" ]; then
		return 0  # True (running)
	else
		return 1  # False (not running)
	fi
}

# Function to check if Kafka is ready by trying to list topics
is_kafka_ready() {
	# Try listing topics to check if Kafka is ready
	if docker exec "$KAFKA_CONTAINER" kafka-topics.sh --bootstrap-server "$BROKER" --list >/dev/null 2>&1; then
		return 0  # Kafka is ready
	else
		return 1  # Kafka is not ready
	fi
}

# Function to wait for Kafka to be ready
wait_for_kafka() {
	local elapsed=0
	while [ "$elapsed" -lt "$TIMEOUT" ]; do
		if is_kafka_ready; then
			echo "Kafka is ready. Proceeding to create topics..."
			return 0
		else
			echo "Waiting for Kafka to be ready... (elapsed time: $elapsed seconds)"
			sleep "$SLEEP_INTERVAL"
			elapsed=$((elapsed + SLEEP_INTERVAL))
		fi
	done
	echo "Error: Timed out waiting for Kafka to be ready."
	exit 1
}

# Function to create a topic if it doesn't exist
create_topic_if_not_exists() {
	local topic_name="$1"
	local partitions="$2"
	local replication_factor="$3"

	# Check if the topic exists
	if ! docker exec "$KAFKA_CONTAINER" kafka-topics.sh --bootstrap-server "$BROKER" --list | grep -w "$topic_name"; then
		echo "Creating topic: $topic_name"
		if docker exec "$KAFKA_CONTAINER" kafka-topics.sh --bootstrap-server "$BROKER" --create \
			--topic "$topic_name" --partitions "$partitions" --replication-factor "$replication_factor"; then
			echo "Topic '$topic_name' created with $partitions partitions and replication factor of $replication_factor."
		else
			echo "Error: Failed to create topic '$topic_name'. Exiting..."
			exit 1  # Exit the script on failure
		fi
	else
		echo "Topic '$topic_name' already exists."
	fi
}

# Main execution flow
if is_container_running; then
	echo "Kafka container '$KAFKA_CONTAINER' is running. Waiting for Kafka to be ready..."
	wait_for_kafka

	# Create topics with 10 partitions and replication factor of 1
	create_topic_if_not_exists "message" 10 1
	create_topic_if_not_exists "gpMessage" 10 1
	create_topic_if_not_exists "unseenCount" 10 1
else
	echo "Error: Kafka container '$KAFKA_CONTAINER' is not running. Exiting..."
	exit 1
fi
