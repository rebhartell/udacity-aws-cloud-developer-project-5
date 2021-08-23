import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllWhatever } from '../../businessLogic/whateverBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/getAllWhatever')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // DONE: Get all Whatever items for a current user
  logger.info('getAllWhatever handler - Processing event', { event })

  const userId = getUserId(event);

  try {

    const items = await getAllWhatever(userId)

    logger.info('getAllWhatever handler - Succesfully got whatever', { items })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }

  } catch (error) {
    logger.error("getAllWhatever handler - Failed to get all whatever", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to get all whatever"
      })
    }
  }
}