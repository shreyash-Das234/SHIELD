#!/usr/bin/env bash
set -e

echo "Starting SHIELD backend..."
(cd server && npm install && npm start)
