#!/bin/bash

# Read the JSON input from stdin
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Log the edit (example: append to a log file)
echo "File edited by Claude: $FILE_PATH at $(date)" >> ./resources/files-audit.log

