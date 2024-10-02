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

# Create the talkverse-backend-proxy network (internal)
create_talkverse_backend_proxy_network() {
  if check_network_exists "talkverse-backend-proxy"; then
    echo "Network 'talkverse-backend-proxy' already exists."
  else
    echo "Creating internal network 'talkverse-backend-proxy'..."
    docker network create --driver bridge --internal "talkverse-backend-proxy"
    echo "'talkverse-backend-proxy' network created."
  fi
}

# Run the network creation functions
create_proxy_network
create_talkverse_backend_proxy_network

echo "Network setup complete."
