#!/bin/bash

echo

function do_npm_install_to_latest {
  set -x
  
  npm install "${1}@latest" --save-${2}
  
  set +x > /dev/null
}

#     "aws-xray-sdk": "^3.3.3",
#     "axios": "^0.19.0",
#     "debug": "^4.3.2",
#     "http-errors": "^1.7.2",
#     "jsonwebtoken": "^8.5.1",
#     "middy": "^0.27.0",
#     "source-map-support": "^0.5.11",
#     "uuid": "^8.3.2",
#     "winston": "^3.2.1"
#   },
#   "devDependencies": {
#     "@types/aws-lambda": "^8.10.17",
#     "@types/axios": "^0.14.0",
#     "@types/http-errors": "^1.6.1",
#     "@types/jsonwebtoken": "^8.3.2",
#     "@types/node": "^10.14.4",
#     "@types/uuid": "^8.3.1",
#     "aws-sdk": "^2.433.0",
#     "serverless-aws-documentation": "^1.1.0",
#     "serverless-iam-roles-per-function": "^3.2.0-e97ab49",
#     "serverless-plugin-tracing": "^2.0.0",
#     "serverless-reqvalidator-plugin": "^1.0.3",
#     "serverless-webpack": "^5.5.1",
#     "ts-loader": "^9.2.5",
#     "typescript": ">=3.8.0",
#     "webpack": "^5.49.0"

# rm -rf node_modules

## declare dependencies
declare -a dependencies=(
  # "aws-xray-sdk"
  # "axios"
  # "debug"
  # "http-errors"
  # "jsonwebtoken"
  # "middy"
  # "source-map-support"
  # "uuid"
  # "winston"
)

## install dependencies
for i in "${dependencies[@]}"
do
  do_npm_install_to_latest "$i" prod
done


## declare dev dependencies
declare -a devDependencies=(
  # "@types/aws-lambda"
  # "@types/http-errors"
  # "@types/jsonwebtoken"
  # "@types/node"
  # "@types/uuid"
  # "aws-sdk"
  # "serverless-aws-documentation"
  "serverless-iam-roles-per-function"
  # "serverless-plugin-tracing"
  # "serverless-reqvalidator-plugin"
  "serverless-webpack"
  # "ts-loader"
  # "typescript"
  # "webpack"
)

## install dev dependencies
for i in "${devDependencies[@]}"
do
  do_npm_install_to_latest "$i" dev
done


echo