// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')
const jwt = require('express-jwt')

// Utilities
const routes = require('./routes/routes')
const handleUnauthorized = require('./lib/handle-unauthorized')
const cacheProvider = require('./lib/cache-provider')

// Initialize cache
cacheProvider.start()

// Initialize a new router
const router = Router()

// CORS
router.use(cors())

// JWT
if (process.env.JWT_SECRET) {
  router.use(jwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/'] }))
}
router.use(handleUnauthorized)

router.get('/', routes.frontpage)
router.get('/users/:username/search/:query', routes.search)
router.get('/users/:username/students/:id', routes.student)
router.get('/groups/:groupId/students', routes.studentsInGroup)
router.get('/users/:username/contactClasses', routes.contactClasses)
router.get('/users/:username/contactTeachers', routes.contactTeachers)
router.get('/teachers/all', routes.teachers)
router.get('/students/all', routes.students)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
