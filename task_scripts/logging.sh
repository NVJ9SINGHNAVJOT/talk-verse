#!/bin/bash

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
