import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import 'source-map-support/register'
import { CreateWhateverModel } from '../models/CreateWhateverModel'
import { UpdateWhateverRequest } from '../requests/UpdateWhateverRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer/WhateverDatabaseAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class WhateverDatabaseAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TableName = process.env.WHATEVER_DB_TABLE,
    private readonly IndexName = process.env.WHATEVER_DB_INDEX
  ) { }


  async getAllWhatever(userId: string): Promise<CreateWhateverModel[]> {

    logger.info("getAllWhatever", { userId })

    const params = {
      TableName: this.TableName,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items = result.Items as CreateWhateverModel[]


    // remove the user id - keep it as a hidden field
    items.forEach(item => { delete item.userId });

    return items
  }


  async getAllWhateverByCategory(userId: string, categoryId: string): Promise<CreateWhateverModel[]> {

    logger.info("getAllWhateverByCategory", { userId, categoryId })

    const params = {
      TableName: this.TableName,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId and categoryId = :categoryId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':categoryId': categoryId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items = result.Items as CreateWhateverModel[]


    // remove the user id - keep it as a hidden field
    items.forEach(item => { delete item.userId });

    return items
  }


  async getWhatever(userId: string, itemId: string): Promise<CreateWhateverModel> {

    logger.info("getWhatever", { userId, itemId })

    const params = {
      TableName: this.TableName,
      Key: { userId: userId, itemId: itemId }
    }

    const result = await this.docClient.get(params).promise()

    if (!result.Item) {
      const errMsg = "Cannot get item that does not exist"

      logger.info(`getWhatever - ${errMsg}`)

      throw new Error(errMsg)
    }

    const whatever = result.Item as CreateWhateverModel

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async createWhatever(whatever: CreateWhateverModel): Promise<CreateWhateverModel> {

    logger.info("createWhatever", { whatever })

    const params = {
      TableName: this.TableName,
      Item: whatever
    }

    await this.docClient.put(params).promise()

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async deleteWhatever(userId: string, itemId: string): Promise<CreateWhateverModel> {

    logger.info("deleteWhatever", { userId, itemId })

    const params = {
      TableName: this.TableName,
      Key: { userId: userId, itemId: itemId },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params).promise()

    if (!result.Attributes) {
      const errMsg = "Cannot delete item that does not exist"

      logger.info(`deleteWhatever - ${errMsg}`)

      throw new Error(errMsg)
    }

    const whatever = result.Attributes as CreateWhateverModel

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async updateWhatever(userId: string, itemId: string, updatedWhatever: UpdateWhateverRequest): Promise<CreateWhateverModel> {

    logger.info("updateWhatever", { userId, itemId, updatedWhatever })

    const params = {
      TableName: this.TableName,
      Key: { userId, itemId },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N=:whateverName, categoryId=:categoryId, formData=:formData",
      ExpressionAttributeValues: {
        ":whateverName": updatedWhatever.name,
        ":categoryId": updatedWhatever.categoryId,
        ":formData": updatedWhatever.formData
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params).promise()

    const updatedItem = result.Attributes as CreateWhateverModel

    // remove the user id - keep it as a hidden field
    delete updatedItem.userId

    return updatedItem
  }


  async updateAttachmentUrl(userId: string, itemId: string, attachmentUrl: string): Promise<string> {

    logger.info("updateAttachmentUrl", { userId, itemId, attachmentUrl })

    const params = {
      TableName: this.TableName,
      Key: { userId, itemId },
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

