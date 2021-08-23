#!/bin/bash

echo

# The following export is required to avoid OOM when using Serverless Framework "package.individually: true"
#   FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
# Alternative: exclude "- serverless-webpack"

export NODE_OPTIONS="--max-old-space-size=8192"

npx sls deploy --verbose

echo