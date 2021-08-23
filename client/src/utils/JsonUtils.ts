

export const IGNORE_ERRORS = true
export const THROW_ERRORS = false


export const prettyPrint = (ugly: string, ignoreErrors: boolean = THROW_ERRORS): string => {

  let pretty: string = ""

  try {
    const jsonObject = JSON.parse(ugly)
    pretty = JSON.stringify(jsonObject, undefined, 4)
  } catch (error) {
    if (!ignoreErrors) {
      throw (error)
    }
  }

  return pretty
}


export const jsonParse = (json: string, ignoreErrors: boolean = THROW_ERRORS): any => {

  let jsonObject: any = {}

  try {
    jsonObject = JSON.parse(json)
  } catch (error) {
    if (! ignoreErrors) {
      throw (error)
    }
  }

  return jsonObject
}


export const jsonStringify = (jsonObject: any, ignoreErrors: boolean = THROW_ERRORS): string => {

  let json: string = ""

  try {
    json = JSON.parse(jsonObject)
  } catch (error) {
    if (! ignoreErrors) {
      throw (error)
    }
  }

  return json
}

