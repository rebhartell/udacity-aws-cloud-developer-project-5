# Whatever You Want - a Serverless application

The Whatever You Want serverless application provides the user with a system that allows the user to manage collections of whatever they want,
such as:

- a Diary
- an Address Book
- a Film Collection
- a deck of Recipe Cards
- Whatever You Want

This is achieved by providing an application that lets the user dynamically create a `category` for the collection and dynamically describe both the data model and the UI data entry form using a pair of JSON schema which are interpreted by the React JSON-Schema Form (RJSF) to drive parts of the UI.

Once a `category` is declared, then instances of `whatever` items can be created using the RJSF.  There is full CRUD support for both categories and instances and all items are private to the user.

To complement the UI `frontend`, there is a `backend` that provides the `AWS cloud` API, lambda processing, and both S3 and DynamoDb storage for the application - all of which is instantiated using the `Serverless Framework`.

<br />

## Category items

Each Category item contains the following fields:

* `userId` (string) - a unique auth0 id for the user
* `itemId` (string) - a unique id for an item
* `name` (string) - name of a Category item (e.g. "Address Book")
* `jsonSchema` (string) - the JSON Schema describing the data model
* `uiSchema` (string) - the UI Schema describing the data entry form
* `createdAt` (string) - date and time when an item was created

<br />

## Whatever items

Each Whatever item contains the following fields:

* `userId` (string) - a unique auth0 id for the user
* `itemId` (string) - a unique id for an item
* `categoryId` (string) - a unique id linking back to the parent Category item
* `name` (string) - name of a Whatever item (e.g. "The Jungle Book")
* `formData` (map) - the JSON object detailing the specific instance of a Category item
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Whatever item
* `createdAt` (string) - date and time when an item was created

<br />

<br />

# Known working environment

* <a href="https://ubuntu.com/" target="_blank">Ubuntu</a> 20.04.2 LTS
  
  ```bash
  lsb_release -a
  ```
  ```bash
  No LSB modules are available.
  Distributor ID:	Ubuntu
  Description:	Ubuntu 20.04.2 LTS
  Release:	20.04
  Codename:	focal
  ```  
  
* <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> v1.59.0

  ```bash
  code --version
  ```
  ```bash
  1.59.0
  379476f0e13988d90fab105c5c19e7abc8b1dea8
  x64
  ```  

* <a href="https://github.com/nvm-sh/nvm" target="_blank">Node Version Manager (nvm)</a> v0.34.0

  ```bash
  nvm --version
  ```
  ```bash
  0.34.0
  ```

  ```bash
  nvm list
  ```
  ```bash
        v12.21.0
        v12.22.0
  ->     v14.16.0
          system
  default -> lts/* (-> v14.16.0)
  node -> stable (-> v14.16.0) (default)
  stable -> 14.16 (-> v14.16.0) (default)
  iojs -> N/A (default)
  unstable -> N/A (default)
  lts/* -> lts/fermium (-> v14.16.0)
  lts/argon -> v4.9.1 (-> N/A)
  lts/boron -> v6.17.1 (-> N/A)
  lts/carbon -> v8.17.0 (-> N/A)
  lts/dubnium -> v10.24.0 (-> N/A)
  lts/erbium -> v12.22.0
  lts/fermium -> v14.16.0
  ```  

* <a href="https://nodejs.org/en/" target="_blank">Node JS</a> v14.16.0

  ```bash
  node --version
  ```
  ```bash
  v14.16.0
  ```


* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">Node Package Manager (npm)</a> v7.20.5

  ```bash
  npm --version
  ```
  ```bash
  7.20.5
  ```

* `Global Node Modules` are kept to a minimum in favour of being local to the application development project
  ```bash
  npm list -g
  ```
  ```bash
  /home/rebh/.nvm/versions/node/v14.16.0/lib
  └── npm@7.20.5
  ```

<br/>


# Prerequisites for hosting the backend services

To further develop and host the application , you will need:

* A <a href="https://github.com" target="_blank">GitHub account</a> to maintain the project source 

* An <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a> for standards based user authentication for both the frontend UI and the backend API

* An <a href="https://aws.amazon.com/free/" target="_blank">AWS (Free Tier) account</a> for cloud based services

* A <a href="https://www.serverless.com/" target="_blank">Serverless Framework account</a>
  
   * Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help to do the following.

   * Install the Serverless Framework’s CLI - this has been included in the backend `package.json` and can be run as follows:
  
      ```bash
      cd backend

      npm ci
      
      npx serverless --version
      
      # or
      
      npx sls --version
      ```
      ```bash
      Framework Core: 2.55.0 (local)
      Plugin: 5.4.3
      SDK: 4.2.6
      Components: 3.15.1
      ```
   * Login and configure serverless to use the AWS credentials
  
      ```bash
      # Login to your dashboard from the CLI.
      # It will ask to open your browser and finish the process.
      npx sls login

      # Configure serverless to use the AWS credentials to deploy the application
      # You need to have a pair of Access keys (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) for an IAM user with Admin access permissions
      npx sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
      ```

<br />

# Packaging and deploying the BACKEND

The `backend` consists of a number of Node JS `handlers` that are deployed as `AWS Lambda serverless` services and use the `AWS SDK` to interact with other AWS services such as `AWS S3` (for attachment storage) and `AWS DynamoDB` (for Category and Whatever database storage).

A major component of the backend is `serverless.yml` which defines the deployment of the handlers and the other required AWS cloud services - for example `AWS Gateway`, `AWS CloudWatch`, and `AWS XRay`.

The `Serverless Framework CLI` (which is included locally through the `package.json` configuration) will process the `serverless.yml` and manage the build and deployment (via `AWS ClodFormation`).

```bash
cd backend

export NODE_OPTIONS="--max-old-space-size=8192"

npx sls deploy --verbose
```
```bash
Serverless: Using provider credentials, configured via dashboard: https://app.serverless.com/rebhartell/apps/serverless-whatever-app/serverless-whatever-service/dev/us-east-1/providers
Serverless: Using configuration:
{
  "concurrency": 2,
  "serializedCompile": false,
  "webpackConfig": "webpack.config.js",
  "includeModules": false,
  "packager": "npm",
  "packagerOptions": {},
  "keepOutputDirectory": false
}
Serverless: Removing /home/rebh/Development/udacity-aws-cloud-developer-project-5/backend/.webpack
Serverless: Individually packaging with concurrency at 2 entries a time.
Serverless: Bundling with Webpack...
...
...
...
Serverless: Removing old service artifacts from S3...
Serverless: Publishing service to the Serverless Dashboard...
Serverless: Successfully published your service to the Serverless Dashboard: https://app.serverless.com/rebhartell/apps/serverless-whatever-app/serverless-whatever-service/dev/us-east-1
```

<br />

**NOTE:**  

The NODE_OPTIONS (--max-old-space-size=8192) are required to avoid Out Of Memory (OOM) issues when using the Serverless Framework configuration **package.individually: true**

<blockquote>
  <p>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory</p>
</blockquote>

An alternative approach, is to exclude the plugin **serverless-webpack** 

<br />

# Configuring, packaging and serving the FRONTEND

The `client` folder contains a web application that can use the `backend` API - the only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application and contains an API endpoint and Auth0 configuration:

## Configure the FRONTEND

```ts
// Once your application is deployed, copy an API id here so that the frontend can interact with it
const apiId = '...'         // API Gateway Id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Create an Auth0 application and copy values from it into this map
  domain: '...',            // Auth0 domain
  clientId: '...',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```

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

npm ci

npm run start
```

<br/>


This should start a development server with the React-based application that will interact with the serverless `Whatever You Want` backend services.


<br/>

```bash
Compiled successfully!

You can now view typescript-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.89:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```
