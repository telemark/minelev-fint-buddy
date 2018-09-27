const nodeCache = require('node-cache')
let cache = null

exports.start = (done) => {
    if (cache) return done()

    cache = new nodeCache({ stdTTL: 3600, checkperiod: 120 })
}

exports.instance = () => cache