#!/bin/bash

# Create the talkverse-backend-proxy network (internal)
create_talkverse_backend_proxy_network() {
  # Check if the network already exists
  if docker network ls | grep -w "talkverse-backend-proxy" > /dev/null 2>&1; then
    echo "Network 'talkverse-backend-proxy' already exists."
  else
    echo "Creating internal network 'talkverse-backend-proxy'..."
    docker network create --driver bridge --internal "talkverse-backend-proxy"
    echo "'talkverse-backend-proxy' network created."
  fi
}

create_talkverse_backend_proxy_network

echo "Network setup complete."
