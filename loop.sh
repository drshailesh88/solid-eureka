#!/bin/bash

# Ralph Wiggum Loop - Autonomous Coding Engine
# Source: https://ghuntley.com/ralph/
#
# Usage:
#   ./loop.sh           # Build mode, unlimited iterations
#   ./loop.sh plan      # Plan mode, unlimited iterations
#   ./loop.sh 50        # Build mode, max 50 iterations
#   ./loop.sh plan 10   # Plan mode, max 10 iterations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
MODE="build"
MAX_ITERATIONS=0  # 0 = unlimited

for arg in "$@"; do
    if [ "$arg" = "plan" ]; then
        MODE="plan"
    elif [[ "$arg" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS=$arg
    fi
done

# Select prompt file based on mode
if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
else
    PROMPT_FILE="PROMPT_build.md"
fi

# Verify prompt file exists
if [ ! -f "$PROMPT_FILE" ]; then
    echo -e "${RED}Error: $PROMPT_FILE not found${NC}"
    exit 1
fi

# Initialize iteration counter
ITERATION=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Ralph Wiggum Loop - $MODE mode${NC}"
if [ $MAX_ITERATIONS -gt 0 ]; then
    echo -e "${BLUE}Max iterations: $MAX_ITERATIONS${NC}"
else
    echo -e "${BLUE}Iterations: unlimited (Ctrl+C to stop)${NC}"
fi
echo -e "${BLUE}========================================${NC}"
echo ""

# The Loop
while true; do
    ITERATION=$((ITERATION + 1))

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Iteration $ITERATION${NC}"
    echo -e "${GREEN}$(date)${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Run Claude with the prompt
    # -p: Headless mode, reads from stdin
    # --dangerously-skip-permissions: Auto-approve all tool calls (required for autonomy)
    # --model: Use Opus for best reasoning
    # --verbose: Detailed logging
    cat "$PROMPT_FILE" | claude -p \
        --dangerously-skip-permissions \
        --model claude-sonnet-4-20250514 \
        --verbose \
        2>&1 | tee "logs/iteration_${ITERATION}.log"

    # Git commit and push after each iteration
    if git diff --quiet && git diff --cached --quiet; then
        echo -e "${YELLOW}No changes to commit${NC}"
    else
        git add -A
        git commit -m "Ralph Wiggum iteration $ITERATION - $MODE mode" || true

        # Push to remote (create branch if needed)
        BRANCH=$(git rev-parse --abbrev-ref HEAD)
        if ! git push origin "$BRANCH" 2>/dev/null; then
            git push --set-upstream origin "$BRANCH"
        fi
    fi

    # Check iteration limit
    if [ $MAX_ITERATIONS -gt 0 ] && [ $ITERATION -ge $MAX_ITERATIONS ]; then
        echo -e "${YELLOW}Reached max iterations ($MAX_ITERATIONS). Stopping.${NC}"
        break
    fi

    # Small delay between iterations
    sleep 2
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Loop completed after $ITERATION iterations${NC}"
echo -e "${BLUE}========================================${NC}"
