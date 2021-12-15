const superagent = require('superagent')
const NodeCache = require( 'node-cache' )
const getCache = new NodeCache()


// Generate form string from object
// Superagent doesn't handle this without multiple sends
const _createFormString = (body: Object) : String => Object.keys(body).map(key => {
  const value = body[key]
  const formattedValue = Array.isArray(value) ? value.join(',') : value
  return `${key}=${formattedValue}`
}).join('&')


type GenericObject = {
  [key: string]: any
}

const get = async (path: String, useCache: Boolean = true) : Promise<GenericObject> => {
  const url = `${process.env.BASEPATH}${path}`

  if (useCache) {
    const cachedResponse = getCache.get(url)
    if (cachedResponse) {
      return cachedResponse
    }
  }

  const response = await superagent.get(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .timeout({
      response: 5000
    })
    .retry(5)

  if (useCache) {
    // Cache for 15 minutes
    getCache.set(url, response.body, 900)
  }

  return response.body
}


const post = async (path: String, body: Object) : Promise<GenericObject> => {
  const url = `${process.env.BASEPATH}${path}`
  const formString = _createFormString(body)

  const response = await superagent.post(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .send(formString)
    .timeout({
      response: 10000
    })
    .retry(5)

  return response.body
}

export {
  _createFormString,
  get,
  post,
}