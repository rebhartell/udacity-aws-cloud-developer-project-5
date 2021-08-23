import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { updateCategory } from '../../businessLogic/categoryBusiness'
import { UpdateCategoryRequest } from '../../requests/UpdateCategoryRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/updateCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Category: Update a Category item with the provided id using values in the "updatedCategory" object
  logger.info('updateCategory handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const updateCategoryRequest: UpdateCategoryRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const updatedItem = await updateCategory(userId, itemId, updateCategoryRequest)

    
    logger.info('updateCategory handler - Successfully updated category', { updatedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
  } catch (error) {
    logger.info('updateCategory handler - Failed to update category', { userId, itemId, updateCategoryRequest })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to update category",
        itemId
      })
    }
  }
}
