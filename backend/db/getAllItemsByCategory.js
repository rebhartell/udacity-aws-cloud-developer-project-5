const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const params = {
  TableName: 'whatever-table-dev',
  IndexName: 'whatever-index-dev',
  KeyConditionExpression: 'userId = :userId and categoryId = :categoryId',
  ExpressionAttributeValues: {
    ':userId': "auth0|60e094fd6c07e100687db898",
    ':categoryId': "1000"
  }
}

dynamoDB
  .query(params)
  .promise()
  .then(data => console.log(JSON.stringify(data,undefined,4)))
  .catch(console.error);
