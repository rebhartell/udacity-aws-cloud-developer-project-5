import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Remove a TODO item by id
  logger.info('deleteTodo handler - Processing event', { event })

  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)

  try {

    const deletedItem = await deleteTodo(userId, todoId)

    logger.info('deleteTodo handler - Successfully deleted todo', { deletedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }

  } catch (error) {
    logger.error("deleteTodo handler - Failed to delete todo", { todoId, error })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to delete todo",
        todoId
      })
    }
  }

}
