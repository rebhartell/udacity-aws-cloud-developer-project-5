const AWS = require('aws-sdk');
const { randomInt } = require('crypto');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "whatever-table-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function updateItem(userId, itemId, updatedWhatever) {

  const params = {
    TableName: TABLE_NAME,
    Key: { userId, itemId },
    ExpressionAttributeNames: { "#N": "name" },
    UpdateExpression: "set #N=:name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues: {
      ":name": updatedWhatever.name,
      ":dueDate": updatedWhatever.dueDate,
      ":done": updatedWhatever.done
    },
    ReturnValues: "ALL_NEW"
  }

  try {
    const response = await dynamoDB
      .update(params)
      .promise();

    if (!response.Attributes) {
      console.log("response.Attributes do not exist");
    }

    console.log("Item is created!", JSON.stringify(response, null, 2));

  } catch (error) {
    console.log("Item is not created :(", error.message);
    console.log(JSON.stringify(error, null, 2));
  }

}


const itemId = "1004"

const whateverItem = {
  name: "test whatever update " + randomInt(1000).toString(),
  dueDate: new Date().toISOString(),
  done: true,
  formData: {
    title: "miss",
    name: {
      firstName: "Little",
      lastName: "Sunshine"
    }
  } 
}

updateItem(USER_ID, itemId, whateverItem);
