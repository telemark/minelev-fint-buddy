const axios = require('axios').create()
const logger = require('./logger')

const cacheProvider = require('./cache-provider')

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
    
    let entries = await cacheProvider.instance().get(url)
    
    if ( entries == undefined ){
      const { data } = await axios.get(url, config)
      entries = data && data._embedded && data._embedded._entries ? data._embedded._entries : data

      cacheProvider.instance().set(url, entries)
    }
    

    return entries
  } catch (error) {
    logger('error', ['getData', error])
  }
}
