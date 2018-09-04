const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { send } = require('micro')
const logger = require('./logger')

exports.frontpage = async (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = await readFile('./README.md', 'utf-8')
  send(response, 200, md.render(readme))
}

exports.search = async (request, response) => {
  const { username, query } = request.params
  logger('info', ['routes', 'search', 'username', username, 'query', query])
  const data = require('../data/search-results.json')
  send(response, 200, data)
}

exports.student = async (request, response) => {
  const { username, id } = request.params
  logger('info', ['routes', 'student', 'username', username, 'id', id])
  const data = require('../data/student.json')
  send(response, 200, data)
}

exports.students = async (request, response) => {
  const { groupId } = request.params
  logger('info', ['routes', 'students', 'groupId', groupId])
  const data = require('../data/student.json')
  send(response, 200, data)
}

exports.contactClasses = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactClasses', 'username', username])
  const data = require('../data/classes.json')
  send(response, 200, data)
}

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  const data = require('../data/contact-teachers.json')
  send(response, 200, data)
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  const data = require('../data/teachers.json')
  send(response, 200, data)
}
