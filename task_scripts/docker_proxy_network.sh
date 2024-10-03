#!/bin/bash

# Function to check if a network exists
check_network_exists() {
  network_name=$1
  if docker network ls --format "{{.Name}}" | grep -w "$network_name" > /dev/null 2>&1; then
    return 0  # Network exists
  else
    return 1  # Network does not exist
  fi
}

# Create the proxy network (external)
create_proxy_network() {
  if check_network_exists "proxy"; then
    echo "Network 'proxy' already exists."
  else
    echo "Creating external network 'proxy'..."
    docker network create --driver bridge --external "proxy"
    echo "'proxy' network created."
  fi
}

create_proxy_network