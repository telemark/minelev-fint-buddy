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
router.get('/users/:username/search/:query', routes.search)
router.get('/users/:username/students/:id', routes.student)
router.get('/groups/:groupId/students', routes.students)
router.get('/users/:username/contactClasses', routes.contactClasses)
router.get('/users/:username/contactTeachers', routes.contactTeachers)
router.get('/teachers/all', routes.teachers)
router.get('/test', routes.test)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
