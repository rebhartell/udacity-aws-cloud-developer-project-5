import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('lambda/http/updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info('updateTodo handler - Processing event', { event })

  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const updatedItem = await updateTodo(userId, todoId, updatedTodo)

    logger.info('updateTodo handler - Successfully updated todo', { updatedItem })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
  } catch (error) {
    logger.info('updateTodo handler - Failed to update todo', { userId, todoId, updatedTodo })

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Failed to update todo",
        todoId
      })
    }
  }
}
