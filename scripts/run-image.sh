#!/bin/sh

ERROR='\033[0;31m'
WARNING='\033[0;33m'
NC='\033[0m' # No Color

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

run_container() {
  local container_tool=$1
  local port=$2
  local image_id=$3

  $container_tool run --rm -p "$port:$port" -e PORT=$port -it "$image_id"
}

build_and_run() {
  local port=$1

  # Select container tool (podman or docker)
  local tool
  if command_exists podman; then
    tool="podman"
  elif command_exists docker; then
    tool="docker"
  else
    echo -e "${ERROR}Install Podman or Docker${NC}"
    exit 1
  fi

  echo "Building image with $tool"
  BUILD_OUTPUT=$($tool build . 2>&1) || {
    echo -e "${ERROR}Build failed:${NC}\n$BUILD_OUTPUT"
    exit 1
  }
  IMAGE_ID=$(echo "$BUILD_OUTPUT" | tail -1)

  SIZE=$($tool image inspect "$IMAGE_ID" --format='{{.Size}}' | \
    awk '{printf "%d MB", $1/1024/1024}')
  echo -e "${WARNING}Image size: ${SIZE}${NC}"
  echo "Open: http://localhost:$port"

  run_container "$tool" "$port" "$IMAGE_ID"
}

build_and_run 8080
