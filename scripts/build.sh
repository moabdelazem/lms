#!/bin/env bash
set -e

# Configuration
REGISTRY="${REGISTRY:-moabdelazem}"
PUSH="${PUSH:-true}"

# Define images to build: name and context path (relative to repo root)
declare -A IMAGES=(
  ["lms-api"]="api"
  ["lms-web"]="web"
)

# Get git hash and branch
GIT_HASH=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Build tags
TAGS=("${GIT_HASH}" "latest")

# Add branch tag if not main/master
if [[ "$GIT_BRANCH" != "main" && "$GIT_BRANCH" != "master" ]]; then
  TAGS+=("${GIT_BRANCH}")
fi

echo "=============================================="
echo "LMS Docker Build & Push Script"
echo "=============================================="
echo "Registry: ${REGISTRY}"
echo "Tags: ${TAGS[*]}"
echo "Git hash: ${GIT_HASH}"
echo "Push enabled: ${PUSH}"
echo "=============================================="
echo ""

# Get the script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Build and push each image
for IMAGE_NAME in "${!IMAGES[@]}"; do
  CONTEXT="${IMAGES[$IMAGE_NAME]}"
  FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}"
  
  echo "----------------------------------------------"
  echo "Building: ${FULL_IMAGE}"
  echo "Context: ${CONTEXT}"
  echo "----------------------------------------------"
  
  # Build tag arguments
  TAG_ARGS=""
  for tag in "${TAGS[@]}"; do
    TAG_ARGS="${TAG_ARGS} -t ${FULL_IMAGE}:${tag}"
  done
  
  # Build the image
  docker build ${TAG_ARGS} "${REPO_ROOT}/${CONTEXT}"
  
  echo "Build complete: ${FULL_IMAGE}"
  
  # Push if enabled
  if [[ "$PUSH" == "true" ]]; then
    echo "Pushing ${FULL_IMAGE}..."
    for tag in "${TAGS[@]}"; do
      docker push "${FULL_IMAGE}:${tag}"
      echo "Pushed: ${FULL_IMAGE}:${tag}"
    done
  fi
  
  echo ""
done

echo "=============================================="
echo "All builds complete!"
echo "=============================================="
echo ""
echo "Built images:"
for IMAGE_NAME in "${!IMAGES[@]}"; do
  echo "  - ${REGISTRY}/${IMAGE_NAME}:${GIT_HASH}"
done
