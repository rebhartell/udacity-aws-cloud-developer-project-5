const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})

documentClient.batchWrite({
  RequestItems: {
    'category-table-dev': [
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "1000",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Note Book",
            "jsonSchema": `{"title":"Test form","type":"string"}`,
            "uiSchema": `{"classNames":"custom-css-class"}`
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "1001",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Address Book",
            "jsonSchema": `{"title":"Test form","type":"string"}`,
            "uiSchema": `{"classNames":"custom-css-class"}`
          }
        }
      }, {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "1002",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Diary",
            "jsonSchema": `{"title":"Test form","type":"string"}`,
            "uiSchema": `{"classNames":"custom-css-class"}`
          }
        }
      }, {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "1003",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Book Collection",
            "jsonSchema": `{"title":"Test form","type":"string"}`,
            "uiSchema": `{"classNames":"custom-css-class"}`
          }
        }
      },
    ]
  }
}).promise()
  .then(() => {
    console.log('Items added')
  })
  .catch((e) => [
    console.log('Failed: ', e.message)
  ])
