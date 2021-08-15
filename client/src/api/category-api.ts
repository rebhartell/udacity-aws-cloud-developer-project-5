import { CategoryItem } from '../types/CategoryItem';

let id = 0;

function nextId() { return id++ }

function prettyPrint(ugly: string): string {
  var obj = JSON.parse(ugly)
  var pretty = JSON.stringify(obj, undefined, 4)
  return pretty
}

function nextItem() {
  return {
    itemId: `${nextId()}`,
    name: `Category ${id}`,
    jsonSchema: prettyPrint(`{ "title": "Test form", "type": "string" }`),
    uiSchema: prettyPrint(`{ "classNames": "custom-css-class" }`),
    createdAt: "2021-08-08T12:00:00.000Z"
  }
}

let MOCK_RESPONSE_ALL = [
  nextItem(),
  nextItem(),
  nextItem()
]

function doNothing(s: string) {
  if (s === "hello") {
    // do nothing
  }
}

const COLLECTION_DELAY = 5000

const ITEM_DELAY = 1000

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAllCategory(idToken: string): Promise<CategoryItem[]> {
  console.log('Fetching all category')

  // const response = await Axios.get(`${apiEndpoint}/category`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   },
  // })
  // console.log('All Category:', response.data)
  // return response.data.items
  
  await sleep(COLLECTION_DELAY)

  doNothing(idToken)

  const clonedItems = JSON.parse(JSON.stringify(MOCK_RESPONSE_ALL))

  return clonedItems
}

export async function getCategory(
  idToken: string,
  itemId: string
): Promise<CategoryItem> {
  // const response = await Axios.get(`${apiEndpoint}/category/${itemId}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   }
  // })
  // return response.data.item

  await sleep(ITEM_DELAY)

  doNothing(idToken)

  let index = MOCK_RESPONSE_ALL.findIndex((item => item.itemId === itemId))

  const clonedItem = JSON.parse(JSON.stringify(MOCK_RESPONSE_ALL[index]))

  return clonedItem
}

export async function createCategory(
  idToken: string,
  newCategory: CategoryItem
): Promise<CategoryItem> {
  // const response = await Axios.post(`${apiEndpoint}/category`, JSON.stringify(newCategory), {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   }
  // })
  // return response.data.item

  await sleep(ITEM_DELAY)

  doNothing(idToken)

  newCategory.itemId = `${nextId()}`;

  MOCK_RESPONSE_ALL.push(newCategory)

  return newCategory
}

export async function patchCategory(
  idToken: string,
  itemId: string,
  updatedCategory: CategoryItem
): Promise<void> {
  // await Axios.patch(`${apiEndpoint}/category/${itemId}`, JSON.stringify(updatedCategory), {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   }
  // })

  await sleep(ITEM_DELAY)

  doNothing(idToken)

  let index = MOCK_RESPONSE_ALL.findIndex((item => item.itemId === itemId))

  MOCK_RESPONSE_ALL[index] = updatedCategory
}

export async function deleteCategory(
  idToken: string,
  itemId: string
): Promise<void> {
  // await Axios.delete(`${apiEndpoint}/category/${itemId}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   }
  // })

  await sleep(ITEM_DELAY)

  MOCK_RESPONSE_ALL = MOCK_RESPONSE_ALL.filter(item => item.itemId !== itemId)
}

