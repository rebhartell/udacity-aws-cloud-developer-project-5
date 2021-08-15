import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createCategory } from '../../businessLogic/categoryBusiness'
import { CreateCategoryRequest } from '../../requests/CreateCategoryRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/createCategory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Category: Implement creating a new Category item
  logger.info('createCategory handler - Processing event', { event })

  const newCategory: CreateCategoryRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {

    const newItem = await createCategory(userId, newCategory)

    logger.info('createCategory handler - Successfully created Category', { newItem })

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
    logger.error("createCategory handler - Failed to create Category", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to create Category"
      })
    }
  }
}
