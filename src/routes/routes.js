const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { send, sendError, createError } = require('micro')
const logger = require('../lib/logger')

const fint = require('../lib/fint-client')
const dM = require('./data-mapper')

exports.frontpage = async (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = await readFile('./README.md', 'utf-8')
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
    const fintInstance = await fint()

    const personalressurs = await fintInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/ansattnummer/' + username) 
    const skoleressurs = await fintInstance.getData(dM.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintInstance.getData(dM.undervisningsforholdUrl(skoleressurs))

    const elevforhold = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elevforhold/systemid/' + id) //using systemid
    // const elev = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/elevnummer/' + username) using elevnummer
    // const elevforhold = await fintInstance.getData(dM.elevforholdUrl(elev))

    const teacherGroups = await dM.allGroupUrls(undervisningsforhold)
    const studentGroups = await dM.allGroupUrls(elevforhold)
    
    if (studentGroups.some(v => teacherGroups.includes(v))) {
      const skole = await fintInstance.getData(dM.skoleUrl(elevforhold))
      const elev = await fintInstance.getData(dM.elevUrl(elevforhold))
      const person = await fintInstance.getData(dM.personUrl(elev))

      send(response, 200, await dM.StudentGroup(elev, person, skole, groups))

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
    const fintInstance = await fint()

    const group = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/basisgruppe/systemid/' + groupId)

    let promises = dM.memberUrls(group).map(elevforholdUrl => {
      return new Promise(async (resolve, reject) => {
        const elevforhold = await fintInstance.getData(elevforholdUrl)
        const elev = await fintInstance.getData(dM.elevUrl(elevforhold))
        const person = await fintInstance.getData(dM.personUrl(elev))
        resolve(dM.Student(elev, person))
      })
    })

    Promise.all(promises).then((students) => send(response, 200, students))
  } catch (error) {
    sendError(request, response, error)
  }
}


exports.contactClasses = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactClasses', 'username', username])

  try {
    const fintInstance = await fint()
    const personalressurs = await fintInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/ansattnummer/' + username)
    const skoleressurs = await fintInstance.getData(dM.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintInstance.getData(dM.undervisningsforholdUrl(skoleressurs))

    const promises = dM.contactGroupsUrls(undervisningsforhold).map( contactGroupUrl => {
      return new Promise(async (resolve, reject) => {
        const contactGroup = await fintInstance.getData(contactGroupUrl)
        resolve(dM.contactClass(contactGroup))
      })
      
    })

    Promise.all(promises).then((contactGroups) => send(response, 200, contactGroups))
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  try {
    const fintInstance = await fint()

    const elev = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/elevnummer/' + username)
    const elevforhold = await fintInstance.getData(dM.elevforholdUrl(elev))

    const promises = dM.contactGroupsUrls(elevforhold).map( contactGroupUrl => {
      return new Promise(async (resolve, reject) => {
        const contactGroup = await fintInstance.getData(contactGroupUrl)

        const nestedPromises = dM.undervisningsforholdUrls(contactGroup).map( undervisningsforholdUrl => {
          return new Promise(async (resolve, reject) => {
            const undervisningsforhold = await fintInstance.getData(undervisningsforholdUrl)
            const skoleressurs = await fintInstance.getData(dM.skoleressursUrl(undervisningsforhold))
            const personalressurs = await fintInstance.getData(dM.personalressursUrl(skoleressurs)) //returns 404

            resolve(dM.contactTeacher(personalressurs, contactGroup))
          })
        })
        
        Promise.all(nestedPromises).then((contactTeachers) => resolve(contactTeachers))
      })
      
    })
    Promise.all(promises).then((contactTeachers) => send(response, 200, contactTeachers))
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  try {
    const fintInstance = await fint()

    const undervisningsforholds = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/undervisningsforhold/')

    let promises = undervisningsforholds.map(undervisningsforhold => {
      return new Promise(async (resolve, reject) => {
        const skoleressurs = await fintInstance.getData(dM.skoleressursUrl(undervisningsforhold))
        const personalressurs = await fintInstance.getData(dM.personalressursUrl(skoleressurs)) // returns 404
        const person = await fintInstance.getData(dM.personUrl(personalressurs))
        const skole = await fintInstance.getData(dM.skoleUrl(skoleressurs))

        resolve(dM.Teacher(personalressurs, person, skole))
      })
    })

    Promise.all(promises).then((teachers) => send(response, 200, teachers))
  } catch (error) {
    sendError(request, response, error)
  }
}
