import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getWhatever } from '../../businessLogic/whateverBusiness'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/getWhatever')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Whatever: Get a Whatever item by id
  logger.info('getWhatever handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const userId = getUserId(event)

  try {

    const getItem = await getWhatever(userId, itemId)

    logger.info('getWhatever handler - Successfully retrieved whatever', { getItem })

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
    logger.error("getWhatever handler - Failed to retrieve whatever", { itemId, error })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to retrieve whatever",
        itemId
      })
    }
  }

}
