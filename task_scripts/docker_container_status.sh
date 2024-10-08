#!/bin/bash

source ./logging.sh

# Function to check if the container exists
does_container_exist() {
    local container_name="$1"

    # Exit if no container name is given
    if [ -z "$container_name" ]; then
        logerr "No container name provided."
        exit 1
    fi

    # Check if the container exists
    if ! docker inspect --type container "$container_name" > /dev/null 2>&1; then
        logerr "Container '$container_name' does not exist."
        return 1  # Container does not exist
    fi
    return 0  # Container exists
}

# Function to check if the container is running
is_container_running() {
    local container_name="$1"

    # Exit if no container name is given
    if [ -z "$container_name" ]; then
        logerr "No container name provided."
        exit 1
    fi

    # Get the container's status using inspect and check if it's running
    local status
    if ! status=$(docker inspect -f '{{.State.Status}}' "$container_name" 2>/dev/null); then
        logerr "Failed to get status for container '$container_name'."
        exit 1
    fi

    if [[ "$status" == "running" ]]; then
        return 0  # True (running)
    else
        return 1  # False (not running)
    fi
}
