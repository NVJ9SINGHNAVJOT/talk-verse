#!/bin/bash

# Define topics and their default partition values
declare -A topics_and_partitions=(
    ["message"]=100
    ["gpMessage"]=100
    ["unseenCount"]=100
)

# Export the topics_and_partitions array for use in other scripts
export topics_and_partitions
