const axios = require('axios').create()
const axiosTiming =  require('../dev-helpers/axios-timing')

module.exports = async (url, token, orgId) => {
  if (!url) {
    throw Error('Missing required input: url')
  }
  if (!token) {
    throw Error('Missing required input: token')
  }
  if (!orgId) {
    throw Error('Missing required input: orgID')
  }

  const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-client': 'fint-client',
        'x-org-id': orgId
      }
  }
  try {
    const { data } = await axios.get(url, config)
    const entries = data && data._embedded && data._embedded._entries ? data._embedded._entries : data
    // axiosTiming(axios, console.log) logs individual request times
    return entries
  } catch (error) {
    throw error
  }
}
