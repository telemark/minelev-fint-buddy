// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')
const jwt = require('express-jwt')

// Utilities
const routes = require('./lib/routes')
const handleUnauthorized = require('./lib/handle-unauthorized')
const config = require('./config')

// Initialize a new router
const router = Router()

// CORS
router.use(cors())

// JWT
router.use(jwt({ secret: config.JWT_SECRET }).unless({ path: ['/'] }))
router.use(handleUnauthorized)

router.get('/', routes.frontpage)
router.get('/stats/total', routes.total)
router.get('/stats/total/:type', routes.total)
router.get('/stats/total/:type/:category', routes.total)
router.get('/stats/total/category/:category', routes.categoryTotal)
router.get('/stats/schools', routes.schools)
router.get('/stats/schools/:type', routes.schools)
router.get('/stats/schools/category/:category', routes.categorySchools)
router.get('/stats/usage', routes.usage)
router.get('/stats/usage/:type', routes.usage)
router.get('/stats/time', routes.time)
router.get('/stats/time/:type', routes.time)
router.get('/stats/time/:type/:category', routes.time)
router.get('/stats/categories', routes.categories)
router.get('/stats/queue', routes.queue)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
