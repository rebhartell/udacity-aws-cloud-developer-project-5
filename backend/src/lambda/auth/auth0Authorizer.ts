import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import Axios from 'axios'
import { decode, verify } from 'jsonwebtoken'
import 'source-map-support/register'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { createLogger } from '../../utils/logger'


const logger = createLogger('lambda/auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-5itt2yl2.eu.auth0.com/.well-known/jwks.json'

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('auth0Authorizer handler - Authorizing a user', { authorizationToken: event.authorizationToken })
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('auth0Authorizer handler - User was authorized', { jwtToken })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {


  // DONE: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // The following code has been heavily based on that guide.

  // 1. Retrieve the JWKS and filter for potential signature verification keys.
  const response = await Axios.get(jwksUrl);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to retrieve JWKS - HTTP status ${response.status} - ${response.statusText}`)
  }

  const jwks = response.data;
  const keys: any[] = jwks.keys;

  if (!keys || !keys.length) {
    throw new Error('The JWKS endpoint did not contain any keys');
  }

  const signingKeys = keys
    .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signature verification
      && key.kty === 'RSA' // We are only supporting RSA (RS256)
      && key.kid           // The `kid` must be present to be useful for later
      && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    ).map(key => {
      return { kid: key.kid, nbf: key.nbf, x5c: key.x5c[0] };
    });

  // If at least one signing key doesn't exist we have a problem... Kaboom.
  if (!signingKeys.length) {
    throw new Error('The JWKS endpoint did not contain any signature verification keys');
  }


  // 2. Extract the JWT from the request's authorization header.
  const token = getToken(authHeader)


  // 3. Decode the JWT and grab the kid property from the header.
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const kid: string = jwt.header.kid;


  // 4. Find the signature verification key in the filtered JWKS with a matching kid property.
  const signingKey = signingKeys.find(key => key.kid === kid);

  if (!signingKey) {
    throw new Error(`Unable to find a signing key that matches '${kid}'`);
  }


  // 5. Using the x5c property build a certificate which will be used to verify the JWT signature.
  let certValue: string = certToPEM(signingKey.x5c);


  // 6. Ensure the JWT contains the expected audience, issuer, expiration, etc.
  let jwtPayload: JwtPayload = verify(token, certValue, { algorithms: ['RS256'] }) as JwtPayload;


  return jwtPayload
}

/**
 * Convert a given flat unformatted certifificate into a PEM formatted cerificate
 * @param   cert given flat unformatted certifificate
 * @returns      PEM formatted cerificate
 */
function certToPEM(cert: string): string {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}

/**
 * Check for and extract the token from the Authorisation field of an HTTP header
 * @param   authHeader Authorisation field of an HTTP header
 * @returns            token
 */
function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
