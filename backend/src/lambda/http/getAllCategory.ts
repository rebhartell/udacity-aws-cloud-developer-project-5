import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllCategory } from '../../businessLogic/categoryBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/getAllCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // DONE: Get all Categories items for a current user
  logger.info('getAllCategory handler - Processing event', { event })

  const userId = getUserId(event);

  try {

    const items = await getAllCategory(userId)

    logger.info('getAllCategory handler - Succesfully got category', { items })

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
    logger.error("getAllCategory handler - Failed to get all categories", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to get all categories"
      })
    }
  }
}