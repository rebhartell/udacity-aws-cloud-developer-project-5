import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import 'source-map-support/register'
import { CreateWhateverModel as Item } from '../models/CreateWhateverModel'
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


  async getAllWhatever(userId: string): Promise<Item[]> {

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

    const items = result.Items as Item[]


    // remove the user id - keep it as a hidden field
    items.forEach(item => { delete item.userId });

    return items
  }


  async getWhatever(userId: string, itemId: string): Promise<Item> {

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

    const whatever = result.Item as Item

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async createWhatever(whatever: Item): Promise<Item> {

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


  async deleteWhatever(userId: string, itemId: string): Promise<Item> {

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

    const whatever = result.Attributes as Item

    // remove the user id - keep it as a hidden field
    delete whatever.userId

    return whatever
  }


  async updateWhatever(userId: string, itemId: string, updatedWhatever: UpdateWhateverRequest): Promise<Item> {

    logger.info("updateWhatever", { userId, itemId, updatedWhatever })

    const params = {
      TableName: this.TableName,
      Key: { userId, itemId },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N=:whateverName, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
        ":whateverName": updatedWhatever.name,
        ":dueDate": updatedWhatever.dueDate,
        ":done": updatedWhatever.done
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params).promise()

    const updatedItem = result.Attributes as Item

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

