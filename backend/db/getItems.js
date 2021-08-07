const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const params = {
  TableName: 'Todos-dev',
  IndexName: 'Todos-index-dev',
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: {
    ':userId': "auth0|60e094fd6c07e100687db898"
  }
}

dynamoDB
  .query(params)
  .promise()
  .then(data => console.log(data.Items))
  .catch(console.error);
