const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "whatever-table-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function deleteItem(itemId) {

  const params = {
    TableName: TABLE_NAME,
    Key: { userId: USER_ID, itemId: itemId },
    // Expected: { Exists: true },
    ReturnValues: "ALL_OLD"
  }

  try {
    const response = await dynamoDB
      .delete(params)
      .promise();

    if (!response.Attributes) {
      throw new Error('Cannot delete item that does not exist')
    }

    console.log("Item is deleted!", JSON.stringify(response, null, 2));

  } catch (error) {
    console.log("Item is not deleted :(", error.message);
    console.log(JSON.stringify(error, null, 2))
  }

}

deleteItem("111");