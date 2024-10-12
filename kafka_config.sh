#!/bin/bash

# Define topics and their default partition values
declare -A topics_and_partitions=(
    ["message"]=100
    ["gp-message"]=100
    ["unseen-count"]=100
    ["talkverse-failed-letter-queue"]=10
)

# Export the topics_and_partitions array for use in other scripts
export topics_and_partitions
