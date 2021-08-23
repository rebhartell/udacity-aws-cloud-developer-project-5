const AWS = require('aws-sdk');
const { randomInt } = require('crypto');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = "whatever-table-dev"
const USER_ID = "auth0|60e094fd6c07e100687db898"

async function createItem(whateverItem) {

  const params = {
    TableName: TABLE_NAME,
    Item: whateverItem,
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


const itemId = "3000"
const categoryId = "2000"

const whateverItem = {
  userId: USER_ID,
  itemId: itemId,
  categoryId: categoryId,
  name: "test create whatever " + randomInt(1000).toString(),
  createdAt: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  done: false,
  formData: {
    title: "mr",
    name: {
      firstName: "Bilbo",
      lastName: "Baggins"
    }
  } 
}

createItem(whateverItem);