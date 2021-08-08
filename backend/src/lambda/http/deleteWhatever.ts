import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteWhatever } from '../../businessLogic/whateverBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/deleteWhatever')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Whatever: Remove a Whatever item by id
  logger.info('deleteWhatever handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const userId = getUserId(event)

  try {

    const deletedItem = await deleteWhatever(userId, itemId)

    logger.info('deleteWhatever handler - Successfully deleted whatever', { deletedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }

  } catch (error) {
    logger.error("deleteWhatever handler - Failed to delete whatever", { itemId, error })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to delete whatever",
        itemId
      })
    }
  }

}
