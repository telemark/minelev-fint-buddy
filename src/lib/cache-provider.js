const NodeCache = require('node-cache')
let cache = null

exports.start = (done) => {
  if (cache) return done()

  cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 })
}

exports.instance = () => cache
