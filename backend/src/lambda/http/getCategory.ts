import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getCategory } from '../../businessLogic/categoryBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/getCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Category: Get a Category item by id
  logger.info('getCategory handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const userId = getUserId(event)

  try {

    const getItem = await getCategory(userId, itemId)

    logger.info('getCategory handler - Successfully retrieved category', { getItem })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
        
      },
      body: JSON.stringify({
        item: getItem
      })
    }

  } catch (error) {
    logger.error("getCategory handler - Failed to retrieve category", { itemId, error })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to retrieve category",
        itemId
      })
    }
  }

}
