import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { generateUploadUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  logger.info('generateUploadUrl handler - Processing event', { event })

  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)

  try {
    const uploadUrl = await generateUploadUrl(userId, todoId)

    logger.info('generateUploadUrl handler - Successfully created upload URL', { uploadUrl })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }

  } catch (error) {
    logger.error("generateUploadUrl handler - Failed to create upload URL", { error })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to create upload URL"
      })
    }
  }
}