#!/bin/bash

# Helper script to test custom Datadog checks

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Datadog Custom Check Tester ===${NC}\n"

# Check if container is running
if ! docker ps | grep -q "datadog"; then
    echo -e "${RED}Error: Datadog container is not running${NC}"
    echo "Start it with: docker-compose up -d datadog"
    exit 1
fi

CHECK_NAME=${1:-hello_world}

echo -e "${GREEN}Testing check: ${CHECK_NAME}${NC}\n"

# Run the check
echo -e "${YELLOW}Running check...${NC}"
docker exec -it datadog agent check ${CHECK_NAME}

echo -e "\n${YELLOW}Agent Status (checks section):${NC}"
docker exec -it datadog agent status | grep -A 20 "Checks"

echo -e "\n${GREEN}Done!${NC}"
echo -e "View events in Datadog: ${YELLOW}https://app.datadoghq.com/event/explorer${NC}"
echo -e "Search for tag: ${YELLOW}custom_check:${CHECK_NAME}${NC}"

