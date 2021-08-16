const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})

documentClient.batchWrite({
  RequestItems: {
    'whatever-table-dev': [
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "2000",
            "categoryId": "1000",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-03T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png",
            "formData": {
              "title": "mr",
              "name": {
                "firstName": "Bilbo",
                "lastName": "Baggins"
              }
            }             
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "2001",
            "categoryId": "1001",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-04T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png",
            "formData": {
              "title": "mr",
              "name": {
                "firstName": "Bilbo",
                "lastName": "Baggins"
              }
            }  
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "2002",
            "categoryId": "1000",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-05T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png"
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "2003",
            "categoryId": "1001",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-06T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png"
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "auth0|60e094fd6c07e100687db898",
            "itemId": "2004",
            "categoryId": "1000",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-07T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png"
          }
        }
      },
      {
        PutRequest: {
          Item: {
            "userId": "someone else",
            "itemId": "2005",
            "categoryId": "1001",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Send a letter",
            "dueDate": "2019-07-29T20:01:45.424Z",
            "done": true,
            "attachmentUrl": "http://example.com/image.png"
          }
        }
      }
    ]
  }
}).promise()
  .then(() => {
    console.log('Items added')
  })
  .catch((e) => [
    console.log('Failed: ', e.message)
  ])
