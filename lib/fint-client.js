const getToken = require('./get-token')
const getData = require('./get-data')
const logger = require('./logger')

module.exports = async config => {
  const options = {
    url: config.FINT_AUTH_URL,
    credentials: {
      client: {
        client_id: config.FINT_CLIENT_ID,
        client_secret: config.FINT_CLIENT_SECRET
      },
      auth: {
        username: config.FINT_AUTH_USERNAME,
        password: config.FINT_AUTH_PASSWORD,
        grant_type: 'password',
        scope: 'fint-client'
      }
    },
    orgId: config.FINT_ORG_ID
  }

  try {
    const { access_token: token, expires_in: expires } = await getToken(options)
    return {
      getToken: () => token,
      getData: url => getData(url, token, options.orgId),
      getExpiration: () => expires,
      refreshToken: () => logger('info', ['token', 'refreshed'])
    }
  } catch (error) {
    throw error
  }
}
