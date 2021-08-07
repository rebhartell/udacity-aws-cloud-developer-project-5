const AWS = require('aws-sdk');
const { randomInt } = require('crypto');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "Todos-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function updateItem(userId, todoId, updatedTodo) {

  const params = {
    TableName: TABLE_NAME,
    Key: { userId, todoId },
    ExpressionAttributeNames: { "#N": "name" },
    UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues: {
      ":todoName": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
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


const todoId = "111"

const todoItem = {
  name: "test todo update " + randomInt(1000).toString(),
  dueDate: new Date().toISOString(),
  done: true
}

updateItem(USER_ID, todoId, todoItem);
