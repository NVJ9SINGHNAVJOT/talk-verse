#!/bin/bash

source ./logging.sh

# Create the talkverse-backend-proxy network (internal)
create_talkverse_backend_proxy_network() {
  # Check if the network already exists
  if docker network ls | grep -w "talkverse-backend-proxy" > /dev/null 2>&1; then
    loginf "Network 'talkverse-backend-proxy' already exists."
  else
    loginf "Creating internal network 'talkverse-backend-proxy'..."
    if docker network create --driver bridge --internal "talkverse-backend-proxy"; then
      logsuccess "'talkverse-backend-proxy' network created."
    else
      logerr "Error: Failed to create network 'talkverse-backend-proxy'."
      exit 1
    fi
    
  fi
}

create_talkverse_backend_proxy_network
