#!/bin/bash

# NOTE: Set global variables for the execution of the clone_files script
# Variables:
# REPO_URL - URL of the repository to clone
# DEST_DIR - Directory where files will be copied
# FILES_TO_COPY - Array of file paths to be copied from the repository

# Predefined variables
REPO_URL="https://github.com/NVJ9SINGHNAVJOT/stacks" # Specify your repository URL here
DEST_DIR="task_scripts"                              # Specify your destination directory here
declare -a FILES_TO_COPY=(                           # Array of file paths to copy from the repository
    "scripts/create_kafka_development_container.sh"
    "scripts/docker_container_status.sh"
    "scripts/manage_kafka_topics.sh"
    "scripts/docker_proxy_network.sh"
    "scripts/manage_kafka_config_file_topics.sh"
    "scripts/logging.sh"
)

# Logging functions

# Function to get the current timestamp in light black, including seconds and milliseconds (3 decimal places)
current_time() {
    printf "\e[0;90m$(date +"%Y-%m-%dT%H:%M:%S.%3N%z")\e[0m"  # Print in light black (dark grey)
}

# Function to log information messages
loginf() {
    printf "%s \033[1;34m[INF]\033[0m %s\n" "$(current_time)" "$1"
}

# Function to log error messages
logerr() {
    printf "%s \033[1;31m[ERR]\033[0m \033[0;31m%s\033[0m\n" "$(current_time)" "$1"
}

# Function to log warning messages
war() {
    printf "%s \033[1;33m[WAR]\033[0m %s\n" "$(current_time)" "$1"
}

# Function to log success messages
logsuccess() {
    printf "%s \033[1;32m[SUCCESS]\033[0m %s\n" "$(current_time)" "$1"
}

# Check if the destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    logerr "Error: Destination directory '$DEST_DIR' does not exist."
    exit 1
fi

# Create a temporary directory for cloning the repository
TEMP_DIR=$(mktemp -d 2>/dev/null)

# Check if the temporary directory creation was successful
if [ $? -ne 0 ]; then
    logerr "Error: Failed to create temporary directory."
    exit 1
fi
loginf "Temporary directory '$TEMP_DIR' created successfully."

# Function to cleanup the temporary directory
cleanup_temp_directory() {
    rm -rf "$TEMP_DIR"  # Remove the temporary directory
    if [ $? -ne 0 ]; then
        logwar "Warning: Failed to remove temporary directory '$TEMP_DIR'. Please clean up manually."
    else
        loginf "Temporary directory '$TEMP_DIR' removed successfully."
    fi
}

# Ensure cleanup on script exit
trap cleanup_temp_directory EXIT

# Clone the repository into the temporary directory using --depth 1 for a shallow clone
git clone "$REPO_URL" "$TEMP_DIR" --depth 1

# Check if the cloning was successful
if [ $? -ne 0 ]; then
    logerr "Error: Failed to clone the repository from '$REPO_URL'."
    exit 1
fi
loginf "Cloned the repository from '$REPO_URL' successfully."

# Loop through all the files in the array
for FILE_PATH in "${FILES_TO_COPY[@]}"; do
    # Construct the full destination file path
    DEST_FILE="$DEST_DIR/$(basename "$FILE_PATH")"
    
    # Check if the file exists in the destination directory
    if [ -f "$DEST_FILE" ]; then
        loginf "Removing existing file at '$DEST_FILE'..."
        rm -f "$DEST_FILE"  # Remove existing file
        
        # Check if the deletion was successful
        if [ $? -ne 0 ]; then
            logerr "Error: Failed to delete existing file '$DEST_FILE'."
            exit 1
        fi
    fi

    # Copy the specific file from the cloned repository to the destination directory
    cp "$TEMP_DIR/$FILE_PATH" "$DEST_DIR"

    # Check if the file copying was successful
    if [ $? -ne 0 ]; then
        logerr "Error: Failed to copy the file '$FILE_PATH' to '$DEST_DIR'."
        exit 1
    fi

    loginf "File '$FILE_PATH' cloned successfully to '$DEST_DIR'."
done

# Print a success message indicating that all specified files were successfully cloned and moved
logsuccess "All specified files cloned successfully to '$DEST_DIR'."
