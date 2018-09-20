const getToken = require('fint-get-token')
const getData = require('fint-get-data')
const axios = require('axios')
const logger = require('./logger')

module.exports = async () => {
  const options = {
    url: '***REMOVED***',
    credentials: {
      client: {
        client_id: '***REMOVED***',
        client_secret: '***REMOVED***'
      },
      auth: {
        username: '***REMOVED***',
        password: '***REMOVED***',
        grant_type: 'password',
        scope: 'fint-client'
      }
    }
    
  }
  try {
    const { access_token: token, expires_in: expires } = await getToken(options)
    return {
      getToken: () => token,
      getExpiration: () => expires,
      refreshToken: () => logger('info', ['token', 'refreshed'])
    }
  } catch (error) {
    throw error
  }
}