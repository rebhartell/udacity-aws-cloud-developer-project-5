import Axios from 'axios';
import { apiEndpoint } from '../config';
import { CreateWhateverRequest } from '../types/CreateWhateverRequest';
import { UpdateWhateverRequest } from '../types/UpdateWhateverRequest';
import { WhateverItem } from '../types/WhateverItem';

export async function getWhatever(idToken: string): Promise<WhateverItem[]> {
  console.log('Fetching whatever')

  const response = await Axios.get(`${apiEndpoint}/whatever`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Whatever:', response.data)
  return response.data.items
}

export async function createWhatever(
  idToken: string,
  newWhatever: CreateWhateverRequest
): Promise<WhateverItem> {
  const response = await Axios.post(`${apiEndpoint}/whatever`,  JSON.stringify(newWhatever), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchWhatever(
  idToken: string,
  itemId: string,
  updatedWhatever: UpdateWhateverRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/whatever/${itemId}`, JSON.stringify(updatedWhatever), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteWhatever(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/whatever/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/whatever/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}