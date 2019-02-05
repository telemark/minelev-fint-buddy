const { send, sendError } = require('micro')
const { skoleOptions, personalOptions } = require('../config.js')
const logger = require('../lib/logger')

const fint = require('../lib/fint-client')
const dataMapper = require('./data-mapper')

function mergeArrays (prev, current) {
  if (Array.isArray(current)) {
    prev = prev.concat(current)
  } else {
    prev.push(current)
  }
  return prev
}

function uniqueUsername (prev, current) {
  if (!prev.map(user => user.username).includes(current.username)) {
    prev.push(current)
  }
  return prev
}

/*
  Returns a student
  id => students username
*/
exports.student = async (request, response) => {
  const { id } = request.params
  logger('info', ['routes', 'student', 'id', id])

  try {
    // const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)

    // const personalressurs = await fintPersonalInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/brukernavn/' + username)
    // const skoleressurs = await fintSkoleInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    // const undervisningsforhold = await fintSkoleInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

    // const elevforhold = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elevforhold/systemid/' + id) // using systemid
    const elev = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/brukernavn/' + id) // using student username
    // const elevforhold = await fintSkoleInstance.getData(dataMapper.elevforholdUrl(elev))
    const person = await fintSkoleInstance.getData(dataMapper.elevPersonUrl(elev))

    // const teacherGroups = dataMapper.allGroupUrls(undervisningsforhold)
    // const studentGroups = dataMapper.allGroupUrls(elevforhold)

    send(response, 200, dataMapper.student(elev, person))

    /*
    if (studentGroups.some(studentGroup => teacherGroups.includes(studentGroup))) {
      const skole = await fintSkoleInstance.getData(dataMapper.skoleUrl(elevforhold))
      const elev = await fintSkoleInstance.getData(dataMapper.elevUrl(elevforhold))
      const person = await fintSkoleInstance.getData(dataMapper.personUrl(elev))

      send(response, 200, dataMapper.studentGroup(elev, person, skole))
    } else {
      send(response, 404, 'the student id is not related to the teacher')
    }
    */
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.studentsInGroup = async (request, response) => {
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

/*
 Returns all students
*/

exports.students = async (request, response) => {
  logger('info', ['routes', 'students'])

  try {
    const fintInstance = await fint(skoleOptions)
    const students = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/')
    send(response, 200, students.map(dataMapper.elev))
  } catch (error) {
    sendError(request, response, error)
  }
}

/*
 Returns contact teachers for a student
*/

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  try {
    const fintPersonalInstance = await fint(personalOptions)
    const fintSkoleInstance = await fint(skoleOptions)

    const elev = await fintSkoleInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/brukernavn/' + username)
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

    send(response, 200, contactTeachers.reduce(mergeArrays, []).reduce(uniqueUsername, []))
  } catch (error) {
    sendError(request, response, error)
  }
}
