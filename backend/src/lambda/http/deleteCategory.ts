import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteCategory } from '../../businessLogic/categoryBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/deleteCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Category: Remove a Category item by id
  logger.info('deleteCategory handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const userId = getUserId(event)
  

  try {

    const deletedItem = await deleteCategory(userId, itemId)

    logger.info('deleteCategory handler - Successfully deleted category', { deletedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }

  } catch (error) {
    logger.error("deleteCategory handler - Failed to delete category", { itemId, error })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to delete category",
        itemId
      })
    }
  }

}
