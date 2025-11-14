#!/bin/bash
# node-wrapper.sh — ensures Gradle always finds Node (works with NVM)

export NVM_DIR="$HOME/.nvm"
# Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Use your Node version explicitly
NODE_PATH="$HOME/.nvm/versions/node/v21.6.1/bin/node"

exec "$NODE_PATH" "$@"
