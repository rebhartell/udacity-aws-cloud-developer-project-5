import 'source-map-support/register'
import * as uuid from 'uuid'
import { CategoryDatabaseAccess } from '../databaseLayer/CategoryDatabaseAccess'
import { CreateCategoryModel } from '../models/CreateCategoryModel'
import { CreateCategoryRequest } from '../requests/CreateCategoryRequest'
import { UpdateCategoryRequest } from '../requests/UpdateCategoryRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/categoryBusiness')

const databaseAccess = new CategoryDatabaseAccess()

export async function getAllCategory(userId: string): Promise<CreateCategoryModel[]> {

  logger.info("getAllCategory", { userId })

  const categoryItems = databaseAccess.getAllCategory(userId)

  logger.info("getAllCategory - retrieved all categories for userId", { categoryItems })

  return categoryItems
}

export async function getCategory(userId: string, itemId: string): Promise<CreateCategoryModel> {

  logger.info("getCategory", { userId, itemId })

  const getItem = databaseAccess.getCategory(userId, itemId)

  logger.info("getCategory - get item", { getItem })

  return getItem
}


export async function deleteCategory(userId: string, itemId: string): Promise<CreateCategoryModel> {

  logger.info("deleteCategory", { userId, itemId })

  const deletedItem = databaseAccess.deleteCategory(userId, itemId)

  logger.info("deleteCategory - deleted item", { deletedItem })

  return deletedItem
}

export async function createCategory(userId: string, createCategoryRequest: CreateCategoryRequest): Promise<CreateCategoryModel> {

  logger.info("createCategory", { userId, createCategoryRequest })

  const itemId = uuid.v4()

  const createdItem = await databaseAccess.createCategory({
    itemId: itemId,
    userId: userId,
    name: createCategoryRequest.name,
    createdAt: new Date().toISOString(),
    jsonSchema: '',
    uiSchema: ''
  })

  logger.info("createCategory created item", { createdItem })

  return createdItem
}

export async function updateCategory(userId: string, itemId: string, updateCategoryRequest: UpdateCategoryRequest): Promise<CreateCategoryModel> {

  logger.info("updateCategory", { userId, itemId, updatedCategory: updateCategoryRequest })

  const updatedItem = await databaseAccess.updateCategory(userId, itemId, updateCategoryRequest)

  logger.info("updateCategory - updated item", { updatedItem })

  return updatedItem
}
