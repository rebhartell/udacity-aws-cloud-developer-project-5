import 'source-map-support/register'
import * as uuid from 'uuid'
import { DatabaseAccess } from '../databaseLayer/DatabaseAccess'
import { FileAccess } from '../fileLayer/FileAccess'
import { CreateWhateverModel } from '../models/CreateWhateverModel'
import { CreateWhateverRequest } from '../requests/CreateWhateverRequest'
import { UpdateWhateverRequest } from '../requests/UpdateWhateverRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/whateverBusiness')

const databaseAccess = new DatabaseAccess()

const fileAccess = new FileAccess()


export async function getAllWhatever(userId: string): Promise<CreateWhateverModel[]> {

  logger.info("getAllWhatever", { userId })

  const whateverItems = databaseAccess.getAllWhatever(userId)

  logger.info("getAllWhatever - retrieved all whatever for userId", { whateverItems })

  return whateverItems
}

export async function deleteWhatever(userId: string, itemId: string): Promise<CreateWhateverModel> {

  logger.info("deleteWhatever", { userId, itemId })

  const deletedItem = databaseAccess.deleteWhatever(userId, itemId)

  logger.info("deleteWhatever - deleted item", { deletedItem })

  return deletedItem
}

export async function createWhatever(userId: string, createWhateverRequest: CreateWhateverRequest): Promise<CreateWhateverModel> {

  logger.info("createWhatever", { userId, createWhateverRequest })

  const itemId = uuid.v4()

  const createdItem = await databaseAccess.createWhatever({
    itemId: itemId,
    userId: userId,
    name: createWhateverRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createWhateverRequest.dueDate,
    done: false
  })

  logger.info("createWhatever created item", { createdItem })

  return createdItem
}

export async function updateWhatever(userId: string, itemId: string, updateWhateverRequest: UpdateWhateverRequest): Promise<CreateWhateverModel> {

  logger.info("updateWhatever", { userId, itemId, updatedWhatever: updateWhateverRequest })

  const updatedItem = await databaseAccess.updateWhatever(userId, itemId, updateWhateverRequest)

  logger.info("updateWhatever - updated item", { updatedItem })

  return updatedItem
}

export async function generateUploadUrl(userId: string, itemId: string): Promise<string> {

  logger.info("generateUploadUrl", { userId, itemId })

  const uploadUrl = await fileAccess.generateUploadUrl(itemId)

  logger.info("generateUploadUrl - generated upload url", { uploadUrl })

  // extract the attachment url from the S3 authorisation parameters
  const attachmentUrl = uploadUrl.split("?")[0];

  await databaseAccess.updateAttachmentUrl(userId, itemId, attachmentUrl)

  return uploadUrl
}
