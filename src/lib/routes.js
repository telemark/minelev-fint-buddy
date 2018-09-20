const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { send } = require('micro')
const logger = require('./logger')

const api = require('./fint-api')

exports.frontpage = async (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = await readFile('./README.md', 'utf-8')
  send(response, 200, md.render(readme))
}

exports.search = async (request, response) => {
  const { username, query } = request.params
  logger('info', ['routes', 'search', 'username', username, 'query', query])
  const data = await api.getStudents(username, query)
  send(response, 200, data)
}

exports.student = async (request, response) => {
  const { username, id } = request.params
  logger('info', ['routes', 'student', 'username', username, 'id', id])
  const data = await api.getStudent(username, id)
  send(response, 200, data)
}

exports.students = async (request, response) => {
  const { groupId } = request.params
  logger('info', ['routes', 'students', 'groupId', groupId])
  const data = await api.getStudents(groupId)
  send(response, 200, data)
}

exports.contactClasses = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactClasses', 'username', username])
  const data = await api.getContactClasses(username)
  send(response, 200, data)
}

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  const data = await api.getContactTeachers(username)
  send(response, 200, data)
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  const data = await api.getTeachers()
  send(response, 200, data)
}

exports.test = async (request, response) => {
  logger('info', ['routes', 'test'])
  const data = await api.getTest()
  send(response, 200, data)
}