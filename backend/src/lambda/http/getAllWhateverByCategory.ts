import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllWhateverByCategory } from '../../businessLogic/whateverBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/getAllWhateverByCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Get all Whatever items for a current user and categoryId
  logger.info('getAllWhateverByCategory handler - Processing event', { event })

  const categoryId = event.pathParameters.itemId

  const userId = getUserId(event);

  try {

    const items = await getAllWhateverByCategory(userId, categoryId)

    logger.info('getAllWhateverByCategory handler - Succesfully got whatever', { items })

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
    logger.error("getAllWhateverByCategory handler - Failed to get all whatever", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to get all whatever by categoryId"
      })
    }
  }
}