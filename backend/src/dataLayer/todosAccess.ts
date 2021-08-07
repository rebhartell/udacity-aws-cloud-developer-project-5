import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer/todosAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly IndexName = process.env.INDEX_NAME
  ) { }

  async getAllTodos(userId: string): Promise<TodoItem[]> {

    logger.info("getAllTodos", { userId })

    const params = {
      TableName: this.TodosTable,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items = result.Items as TodoItem[]


    // remove the user id - keep it as a hidden field
    items.forEach(item => { delete item.userId });

    return items
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {

    logger.info("createTodo", { todo })

    const params = {
      TableName: this.TodosTable,
      Item: todo
    }

    await this.docClient.put(params).promise()

    // remove the user id - keep it as a hidden field
    delete todo.userId

    return todo
  }

  async deleteTodo(userId: string, todoId: string): Promise<TodoItem> {

    logger.info("deleteTodo", { userId, todoId })

    const params = {
      TableName: this.TodosTable,
      Key: { userId: userId, todoId: todoId },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params).promise()

    if (!result.Attributes) {
      const errMsg = "Cannot delete item that does not exist"

      logger.info(`deleteTodo - ${errMsg}`)

      throw new Error(errMsg)
    }

    const todo = result.Attributes as TodoItem

    // remove the user id - keep it as a hidden field
    delete todo.userId

    return todo
  }


  async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoItem> {

    logger.info("updateTodo", { userId, todoId, updatedTodo })

    const params = {
      TableName: this.TodosTable,
      Key: { userId, todoId },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
        ":todoName": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params).promise()

    const updatedItem = result.Attributes as TodoItem

    // remove the user id - keep it as a hidden field
    delete updatedItem.userId

    return updatedItem
  }


  async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<string> {

    logger.info("updateAttachmentUrl", { userId, todoId, attachmentUrl })

    const params = {
      TableName: this.TodosTable,
      Key: { userId, todoId },
      UpdateExpression: "set attachmentUrl=:URL",
      ExpressionAttributeValues: {
        ":URL": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }

    const result = await this.docClient.update(params).promise();

    logger.info("updateAttachmentUrl - updated attachmentUrl", { result })

    return attachmentUrl;
  }

}


function createDynamoDBClient(): DocumentClient {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

