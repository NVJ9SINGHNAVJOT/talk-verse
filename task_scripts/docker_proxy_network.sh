#!/bin/bash

create_proxy_network() {
  network_name="proxy"
  
  # Check if the network already exists
  if docker network ls --format "{{.Name}}" | grep -w "$network_name" > /dev/null 2>&1; then
    # Inspect the network to check if it's an external bridge network
    network_driver=$(docker network inspect "$network_name" --format "{{.Driver}}")
    network_scope=$(docker network inspect "$network_name" --format "{{.Scope}}")
    
    if [ "$network_driver" = "bridge" ] && [ "$network_scope" = "global" ]; then
      echo "Network '$network_name' already exists and is an external bridge."
    else
      echo "Network '$network_name' exists but is not an external bridge. Please verify or recreate it."
    fi
  else
    echo "Creating external bridge network '$network_name'..."
    docker network create --driver bridge --scope global "$network_name"
    echo "'$network_name' network created."
  fi
}

create_proxy_network
