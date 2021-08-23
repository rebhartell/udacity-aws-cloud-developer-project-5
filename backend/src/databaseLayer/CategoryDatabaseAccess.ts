import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import 'source-map-support/register'
import { CreateCategoryModel } from '../models/CreateCategoryModel'
import { UpdateCategoryRequest } from '../requests/UpdateCategoryRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer/CategoryDatabaseAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class CategoryDatabaseAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TableName = process.env.CATEGORY_DB_TABLE,
    private readonly IndexName = process.env.CATEGORY_DB_INDEX
  ) { }


  async getAllCategory(userId: string): Promise<CreateCategoryModel[]> {

    logger.info("getAllCategory", { userId })

    const params = {
      TableName: this.TableName,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items = result.Items as CreateCategoryModel[]


    // remove the user id - keep it as a hidden field
    items.forEach(item => { delete item.userId });

    return items
  }


  async getCategory(userId: string, itemId: string): Promise<CreateCategoryModel> {

    logger.info("getCategory", { userId, itemId })

    const params = {
      TableName: this.TableName,
      Key: { userId: userId, itemId: itemId }
    }

    const result = await this.docClient.get(params).promise()

    if (!result.Item) {
      const errMsg = "Cannot get item that does not exist"

      logger.info(`getCategory - ${errMsg}`)

      throw new Error(errMsg)
    }

    const whatever = result.Item as CreateCategoryModel

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async createCategory(whatever: CreateCategoryModel): Promise<CreateCategoryModel> {

    logger.info("createCategory", { whatever })

    const params = {
      TableName: this.TableName,
      Item: whatever
    }

    await this.docClient.put(params).promise()

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async deleteCategory(userId: string, itemId: string): Promise<CreateCategoryModel> {

    logger.info("deleteCategory", { userId, itemId })

    const params = {
      TableName: this.TableName,
      Key: { userId: userId, itemId: itemId },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params).promise()

    if (!result.Attributes) {
      const errMsg = "Cannot delete item that does not exist"

      logger.info(`deleteCategory - ${errMsg}`)

      throw new Error(errMsg)
    }

    const whatever = result.Attributes as CreateCategoryModel

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async updateCategory(userId: string, itemId: string, updatedCategory: UpdateCategoryRequest): Promise<CreateCategoryModel> {

    logger.info("updateCategory", { userId, itemId, updatedCategory })

    const params = {
      TableName: this.TableName,
      Key: { userId, itemId },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N=:name, jsonSchema=:jsonSchema, uiSchema=:uiSchema",
      ExpressionAttributeValues: {
        ":name": updatedCategory.name,
        ":jsonSchema": updatedCategory.jsonSchema,
        ":uiSchema": updatedCategory.uiSchema
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params).promise()

    const updatedItem = result.Attributes as CreateCategoryModel

    // remove the user id - keep it as a hidden field
    delete updatedItem.userId

    return updatedItem
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

