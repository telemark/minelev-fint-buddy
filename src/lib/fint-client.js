const getToken = require('./get-token')
const getData = require('./get-data')
const logger = require('./logger')
const config = require('../config')

module.exports = async () => {
  const options = config.fint

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
