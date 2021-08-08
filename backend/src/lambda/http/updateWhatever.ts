import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { updateWhatever } from '../../businessLogic/whateverBusiness'
import { UpdateWhateverRequest } from '../../requests/UpdateWhateverRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/updateWhatever')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Whatever: Update a Whatever item with the provided id using values in the "updatedWhatever" object
  logger.info('updateWhatever handler - Processing event', { event })

  const itemId = event.pathParameters.itemId

  const updateWhateverRequest: UpdateWhateverRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const updatedItem = await updateWhatever(userId, itemId, updateWhateverRequest)

    logger.info('updateWhatever handler - Successfully updated whatever', { updatedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
  } catch (error) {
    logger.info('updateWhatever handler - Failed to update whatever', { userId, itemId, updateWhateverRequest })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to update whatever",
        itemId
      })
    }
  }
}
