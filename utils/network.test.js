const superagent = require('superagent')
const {
  _createFormString,
  get,
  post,
} = require('./network')


describe('_createFormString', () => {
  it('Creates form string with a single value', () => {
    const body = {
      hello: 'goodbye'
    }
    const formString = _createFormString(body)
    expect(formString).toEqual('hello=goodbye')
  })

  it('Creates form string with multiple values', () => {
    const body = {
      hello: 'goodbye',
      what: 'who?'
    }
    const formString = _createFormString(body)
    expect(formString).toEqual('hello=goodbye&what=who?')
  })

  it('Creates form string, array to comma delineated', () => {
    const body = {
      hello: 'goodbye',
      what: [ 'something', 'somethingelse' ]
    }
    const formString = _createFormString(body)
    expect(formString).toEqual('hello=goodbye&what=something,somethingelse')
  })
})


describe('get', () => {
  let set1
  let set2
  let timeout
  let retry

  beforeEach(() => {
    process.env.BASEPATH = 'https://sandbox.example.com/'
    process.env.APIKEY = 'somekey'

    // Retry
    retry = jest.fn().mockReturnValue({
      body: 'someresponse'
    })

    // Timeout
    timeout = jest.fn().mockReturnValue({
      retry,
    })

    // Last set thats called
    set2 = jest.fn().mockReturnValue({
      timeout,
    })

    // First set thats called. Authorization
    set1 = jest.fn().mockReturnValue({
      set: set2
    })

    superagent.get = jest.fn().mockReturnValue({
      set: set1
    })
  })

  it('Returns the response body; By default, uses the cache', async () => {
    const response = await get('somecachedpath')
    expect(response).toEqual('someresponse')
    expect(superagent.get).toHaveBeenCalledTimes(1)

    const response2 = await get('somecachedpath')
    expect(response2).toEqual('someresponse')
    expect(superagent.get).toHaveBeenCalledTimes(1)
  })

  it('Returns the response body; Does not use cache', async () => {
    const response = await get('somenotcachedpath', false)
    expect(response).toEqual('someresponse')
    expect(superagent.get).toHaveBeenCalledTimes(1)

    const response2 = await get('somenotcachedpath', false)
    expect(response2).toEqual('someresponse')
    expect(superagent.get).toHaveBeenCalledTimes(2)
  })

  it('Creates url out of BASEPATH and path', async () => {
    await get('somepath', false)
    expect(superagent.get).toHaveBeenCalledWith('https://sandbox.example.com/somepath')
  })

  it('Sets authorization header using APIKEY in the proper format', async () => {
    await get('somepath', false)
    expect(set1).toHaveBeenCalledWith('Authorization', 'Bearer somekey')
  })

  it('Sets accept header', async () => {
    await get('somepath', false)
    expect(set2).toHaveBeenCalledWith('Accept', 'application/json')
  })

  it('On failure, throws', async () => {
    superagent.get.mockImplementation(() => {
      throw new Error('Ope')
    })

    try {
      await get('somepath', false)
      expect(1).toEqual(2) // Force failure if nothing is thrown
    } catch (e) {
      expect(e).toEqual(new Error('Ope'))
    }
  })
})


describe('post', () => {
  let set1
  let set2
  let send1
  let retry
  let timeout

  beforeEach(() => {
    process.env.BASEPATH = 'https://sandbox.example.com/'
    process.env.APIKEY = 'somekey'

    // Retry
    retry = jest.fn().mockReturnValue({
      body: 'someresponse'
    })

    // Timeout
    timeout = jest.fn().mockReturnValue({
      retry,
    })

    // Send
    send1 = jest.fn().mockReturnValue({
      timeout,
    })

    // Last set thats called
    set2 = jest.fn().mockReturnValue({
      send: send1
    })

    // First set thats called. Authorization
    set1 = jest.fn().mockReturnValue({
      set: set2
    })

    superagent.post = jest.fn().mockReturnValue({
      set: set1
    })
  })

  it('Returns the response body', async () => {
    const response = await post('somepath', { some: 'body' })
    expect(response).toEqual('someresponse')
  })

  it('Creates url out of BASEPATH and path', async () => {
    await post('somepath', { some: 'body' })
    expect(superagent.post).toHaveBeenCalledWith('https://sandbox.example.com/somepath')
  })

  it('Sets authorization header using APIKEY in the proper format', async () => {
    await post('somepath', { some: 'body' })
    expect(set1).toHaveBeenCalledWith('Authorization', 'Bearer somekey')
  })

  it('Sets accept header', async () => {
    await post('somepath', { some: 'body' })
    expect(set2).toHaveBeenCalledWith('Accept', 'application/json')
  })

  it('Sends formstring', async () => {
    await post('somepath', { some: 'body' })
    expect(send1).toHaveBeenCalledWith('some=body')
  })

  it('On failure, throws', async () => {
    superagent.post.mockImplementation(() => {
      throw new Error('Ope')
    })

    try {
      await post('somepath', { some: 'body' })
      expect(1).toEqual(2) // Force failure if nothing is thrown
    } catch (e) {
      expect(e).toEqual(new Error('Ope'))
    }
  })
})