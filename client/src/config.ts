// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'xn5y1dk4sa'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-5itt2yl2.eu.auth0.com',            // Auth0 domain
  clientId: 'Eu9acInCPst2CVfNaigivcfPnyUUcXjN',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
