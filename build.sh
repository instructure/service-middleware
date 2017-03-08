#!/bin/bash

set -e

docker build \
  --pull --tag service-middleware:latest .

docker run \
  --rm service-middleware:latest bash -c "yarn && yarn test"
