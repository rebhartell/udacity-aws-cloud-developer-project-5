const AWS = require('aws-sdk');
const { randomInt } = require('crypto');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "Todos-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function createItem(todoItem) {

  const params = {
    TableName: TABLE_NAME,
    Item: todoItem,
    ReturnValues: "NONE"
  }

  try {
    const response = await dynamoDB
      .put(params)
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


const todoId = "111"

const todoItem = {
  userId: USER_ID,
  todoId: todoId,
  name: "test todo create " + randomInt(1000).toString(),
  createdAt: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  done: false
}

createItem(todoItem);