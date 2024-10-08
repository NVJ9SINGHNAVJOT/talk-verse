#!/bin/bash

source ./logging.sh

create_proxy_network() {
  local network_name="proxy"
  
  # Check if the network already exists
  if docker network ls --format "{{.Name}}" | grep -w "$network_name" > /dev/null 2>&1; then
    # Inspect the network to check if it's an external bridge network
    if ! network_driver=$(docker network inspect "$network_name" --format "{{.Driver}}"); then
      logerr "Error: Failed to inspect network '$network_name'."
      exit 1
    fi

    if ! network_scope=$(docker network inspect "$network_name" --format "{{.Scope}}"); then
      logerr "Error: Failed to inspect network '$network_name'."
      exit 1
    fi

    if [ "$network_driver" = "bridge" ] && [ "$network_scope" = "global" ]; then
      loginf "Network '$network_name' already exists and is an external bridge."
    else
      logerr "Error: Network '$network_name' exists but is not an external bridge. Please verify or recreate it."
      exit 1
    fi
  else
    loginf "Creating external bridge network '$network_name'..."
    if ! docker network create --driver bridge --scope global "$network_name"; then
      logerr "Error: Failed to create network '$network_name'."
      exit 1
    fi
    logsuccess "'$network_name' network created."
  fi
}

create_proxy_network
