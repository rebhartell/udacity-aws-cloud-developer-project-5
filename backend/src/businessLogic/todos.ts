import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess'
import { FileAccess } from '../fileLayer/fileAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/todos')

const todoAccess = new TodoAccess()

const fileAccess = new FileAccess()


export async function getAllTodos(userId: string): Promise<TodoItem[]> {

  logger.info("getAllTodos", { userId })

  const todoItems = todoAccess.getAllTodos(userId)

  logger.info("getAllTodos - retrieved all todos for userId", { todoItems })

  return todoItems
}

export async function deleteTodo(userId: string, todoId: string): Promise<TodoItem> {

  logger.info("deleteTodo", { userId, todoId })

  const deletedItem = todoAccess.deleteTodo(userId, todoId)

  logger.info("deleteTodo - deleted item", { deletedItem })

  return deletedItem
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  logger.info("createTodo", { userId, createTodoRequest })

  const todoId = uuid.v4()

  const createdItem = await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: false
  })

  logger.info("createTodo created item", { createdItem })

  return createdItem
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoItem> {

  logger.info("updateTodo", { userId, todoId, updatedTodo })

  const updatedItem = await todoAccess.updateTodo(userId, todoId, updatedTodo)

  logger.info("updateTodo - updated item", { updatedItem })

  return updatedItem
}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {

  logger.info("generateUploadUrl", { userId, todoId })

  const uploadUrl = await fileAccess.generateUploadUrl(todoId)

  logger.info("generateUploadUrl - generated upload url", { uploadUrl })

  // extract the attachment url from the S3 authorisation parameters
  const attachmentUrl = uploadUrl.split("?")[0];

  await todoAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)

  return uploadUrl
}
