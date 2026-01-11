#!/bin/bash
set -e

# Configuration
IMAGE_NAME="${IMAGE_NAME:-lms-api}"
REGISTRY="${REGISTRY:-docker.io/moabdelazem}"

# Get git hash
GIT_HASH=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Build tags
TAGS=("${GIT_HASH}" "latest")

# Add branch tag if not main/master
if [[ "$GIT_BRANCH" != "main" && "$GIT_BRANCH" != "master" ]]; then
  TAGS+=("${GIT_BRANCH}")
fi

# Prepend registry if provided
if [[ -n "$REGISTRY" ]]; then
  IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"
fi

echo "Building image: ${IMAGE_NAME}"
echo "Tags: ${TAGS[*]}"
echo "Git hash: ${GIT_HASH}"
echo ""

# Build with all tags
TAG_ARGS=""
for tag in "${TAGS[@]}"; do
  TAG_ARGS="${TAG_ARGS} -t moabdelazem/${IMAGE_NAME}:${tag}"
done

docker build ${TAG_ARGS} .

echo ""
echo "Build complete!"
echo "Image: ${IMAGE_NAME}:${GIT_HASH}"

# Optional: push to registry
if [[ "$1" == "--push" ]]; then
  echo "Pushing to registry..."
  for tag in "${TAGS[@]}"; do
    docker push "moabdelazem/${IMAGE_NAME}:${tag}"
  done
  echo "Push complete!"
fi
