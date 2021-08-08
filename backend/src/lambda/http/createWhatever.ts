import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createWhatever } from '../../businessLogic/whateverBusiness'
import { CreateWhateverRequest } from '../../requests/CreateWhateverRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/createWhatever')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Whatever: Implement creating a new Whatever item
  logger.info('createWhatever handler - Processing event', { event })

  const newWhatever: CreateWhateverRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {

    const newItem = await createWhatever(userId, newWhatever)

    logger.info('createWhatever handler - Successfully created whatever', { newItem })

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }

  } catch (error) {
    logger.error("createWhatever handler - Failed to create whatever", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to create whatever"
      })
    }
  }
}
