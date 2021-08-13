const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "whatever-table-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function getItem(userId, itemId) {

  const params = {
    TableName: TABLE_NAME,
    Key: { userId, itemId }
  }

  try {
    const response = await dynamoDB
      .get(params)
      .promise();

    if (!response.Item) {
      console.log("response.Item does not exist");
    }

    console.log("Retrieved Item", JSON.stringify(response, null, 2));

  } catch (error) {
    console.log("Item is not created :(", error.message);
    console.log(JSON.stringify(error, null, 2));
  }

}

const itemId = "ff92ae23-babd-44f2-8448-48d939715830"

getItem(USER_ID, itemId);
