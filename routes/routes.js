const { readFileSync } = require('fs')
const md = require('markdown-it')()
const { send, sendError } = require('micro')
const { skoleOptions, personalOptions } = require('../config.js')
const logger = require('../lib/logger')

const fint = require('../lib/fint-client')
const dataMapper = require('./data-mapper')

exports.frontpage = async (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readMePath = `${__dirname}/../README.md`
  const readme = readFileSync(`${readMePath}`, 'utf-8')
  send(response, 200, md.render(readme))
}

exports.search = async (request, response) => {
  const { username, query } = request.params
  logger('info', ['routes', 'search', 'username', username, 'query', query])
  const data = {}
  send(response, 200, data)
}

exports.student = async (request, response) => {
  const { username, id } = request.params
  logger('info', ['routes', 'student', 'username', username, 'id', id])

  try {
    const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)

    const personalressurs = await fintPersonalInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/ansattnummer/' + username)
    const skoleressurs = await fintSkoleInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintSkoleInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

    const elevforhold = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elevforhold/systemid/' + id) // using systemid
    // const elev = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/elevnummer/' + username) using elevnummer
    // const elevforhold = await fintInstance.getData(dataMapper.elevforholdUrl(elev))

    const teacherGroups = dataMapper.allGroupUrls(undervisningsforhold)
    const studentGroups = dataMapper.allGroupUrls(elevforhold)

    if (studentGroups.some(studentGroup => teacherGroups.includes(studentGroup))) {
      const skole = await fintSkoleInstance.getData(dataMapper.skoleUrl(elevforhold))
      const elev = await fintSkoleInstance.getData(dataMapper.elevUrl(elevforhold))
      const person = await fintSkoleInstance.getData(dataMapper.personUrl(elev))

      send(response, 200, dataMapper.studentGroup(elev, person, skole))
    } else {
      send(response, 404, 'the student id is not related to the teacher')
    }
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.students = async (request, response) => {
  const { groupId } = request.params
  logger('info', ['routes', 'students', 'groupId', groupId])

  try {
    const fintInstance = await fint(skoleOptions)

    const group = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/basisgruppe/systemid/' + groupId)
    const promises = dataMapper.memberUrls(group).map(async elevforholdUrl => {
      const elevforhold = await fintInstance.getData(elevforholdUrl)
      const elev = await fintInstance.getData(dataMapper.elevUrl(elevforhold))
      const person = await fintInstance.getData(dataMapper.personUrl(elev))
      return dataMapper.student(elev, person)
    })

    const students = await Promise.all(promises)
    send(response, 200, students)
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.contactClasses = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactClasses', 'username', username])

  try {
    const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)
    const personalressurs = await fintPersonalInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/brukernavn/' + username)
    const skoleressurs = await fintSkoleInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintSkoleInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

    const promises = dataMapper.contactGroupsUrls(undervisningsforhold).map(async contactGroupUrl => {
      const contactGroup = await fintSkoleInstance.getData(contactGroupUrl)
      return dataMapper.contactClass(contactGroup)
    })

    const contactGroups = await Promise.all(promises)
    send(response, 200, contactGroups)
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  try {
    const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)

    const elev = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/elevnummer/' + username)
    const elevforhold = await fintSkoleInstance.getData(dataMapper.elevforholdUrl(elev))

    const promises = dataMapper.contactGroupsUrls(elevforhold).map(async contactGroupUrl => {
      const contactGroup = await fintSkoleInstance.getData(contactGroupUrl)

      const nestedPromises = dataMapper.undervisningsforholdUrls(contactGroup).map(async undervisningsforholdUrl => {
        const undervisningsforhold = await fintSkoleInstance.getData(undervisningsforholdUrl)
        const skoleressurs = await fintSkoleInstance.getData(dataMapper.skoleressursUrl(undervisningsforhold))
        const personalressurs = await fintPersonalInstance.getData(dataMapper.personalressursUrl(skoleressurs)) // returns 404

        return dataMapper.contactTeacher(personalressurs, contactGroup)
      })

      const contactTeachers = await Promise.all(nestedPromises)
      return contactTeachers
    })
    const contactTeachers = await Promise.all(promises)
    send(response, 200, contactTeachers)
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  try {
    const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)

    const undervisningsforholds = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/undervisningsforhold/')

    const promises = undervisningsforholds.map(async undervisningsforhold => {
      const skoleressurs = await fintSkoleInstance.getData(dataMapper.skoleressursUrl(undervisningsforhold))
      const personalressurs = await fintPersonalInstance.getData(dataMapper.personalressursUrl(skoleressurs)) // returns 404
      const person = await fintPersonalInstance.getData(dataMapper.personUrl(personalressurs))
      const skole = await fintSkoleInstance.getData(dataMapper.skoleUrl(skoleressurs))

      return dataMapper.teacher(personalressurs, person, skole)
    })

    const teachers = await Promise.all(promises)
    send(response, 200, teachers)
  } catch (error) {
    sendError(request, response, error)
  }
}
