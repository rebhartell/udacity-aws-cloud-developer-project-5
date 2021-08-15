import Axios from 'axios';
import { apiEndpoint } from '../config';
import { CategoryItem } from '../types/CategoryItem';


export async function getAllCategory(idToken: string): Promise<CategoryItem[]> {
  console.log('Fetching all categories')

  const response = await Axios.get(`${apiEndpoint}/category`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('All Categories:', response.data)
  return response.data.items
}

export async function getCategory(
  idToken: string,
  itemId: string
): Promise<CategoryItem> {
  const response = await Axios.get(`${apiEndpoint}/category/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function createCategory(
  idToken: string,
  newCategory: CategoryItem
): Promise<CategoryItem> {

  // fudge to get subset
  const createCategory = {
    name: newCategory.name
  }

  const response = await Axios.post(`${apiEndpoint}/category`, JSON.stringify(createCategory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchCategory(
  idToken: string,
  itemId: string,
  updatedCategory: CategoryItem
): Promise<void> {

  // fudge to get subset
  const patchCategory = {
    name: updatedCategory.name,
    jsonSchema: updatedCategory.jsonSchema,
    uiSchema: updatedCategory.uiSchema
  }

  await Axios.patch(`${apiEndpoint}/category/${itemId}`, JSON.stringify(patchCategory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteCategory(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/category/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
