# Serverless Whatever You Want

# Functionality of the application

This application will allow creating/removing/updating/fetching of Category and Whatever items. 
There is a one-to-many relationship between Category and Whatever items respectively.
Each Whatever item can optionally have an attachment image. 
Each user only has access to Whatever items that he/she has created.
All items are stamped with the id of the user that owns them - the user id is maintaned at the API handler level and is not exposed to the public API.

# Category items

Each Category item contains the following fields:

* `userId` (string) - a unique auth0 id for the user
* `itemId` (string) - a unique id for an item
* `name` (string) - name of a Category item (e.g. "Address Book")
* `jsonSchema` (string) - the JSON Schema describing the data model
* `uiSchema` (string) - the UI Schema describing the data entry form
* `createdAt` (string) - date and time when an item was created


# Whatever items

Each Whatever item contains the following fields:

* `userId` (string) - a unique auth0 id for the user
* `itemId` (string) - a unique id for an item
* `categoryId` (string) - a unique id linking back to the parent Category item
* `name` (string) - name of a Whatever item (e.g. "The Jungle Book")
* `formData` (map) - the JSON object detailing the specific instance of a Category item
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Whatever item
* `createdAt` (string) - date and time when an item was created


# Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 14.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.54.0). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.54.0\
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login

   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   

# Frontend

The `client` folder contains a web application that can use the `backend` API the only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy --verbose
```


**NOTE:**

  *FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory*

<br />

The following export is required to avoid Out Of Memory (OOM) issues when using Serverless Framework configuration **package.individually: true**

<br />

*export NODE_OPTIONS="--max-old-space-size=8192"*

<br />

Alternatively, exclude the plugin **serverless-webpack**

<br />

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Whatever You Want application.
