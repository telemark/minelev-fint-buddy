const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { send, sendError } = require('micro')
const logger = require('./logger')

const fint = require('./fint-client')
const dataMapper = require('./data-mapper')


exports.frontpage = async (request, response) => {
  logger('info', ['routes', 'frontpage'])
  const readme = await readFile('./README.md', 'utf-8')
  send(response, 200, md.render(readme))
}

exports.search = async (request, response) => {
  const { username, query } = request.params
  logger('info', ['routes', 'search', 'username', username, 'query', query])
  send(response, 200, data)
}

exports.student = async (request, response) => {
  const { username, id } = request.params
  logger('info', ['routes', 'student', 'username', username, 'id', id])

  try {
    const fintInstance = await fint()

    // const personalressurs = await fintInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/brukernavn/' + username)
    // const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    // const undervisningsforhold = await fintInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

    const elevforhold = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elevforhold/systemid/' + id)

    const groups = await dataMapper.groups(elevforhold)
    groups.map(async (group, i) => {
      groups[i] = await fintInstance.getData(group['href'])
    })
    if (groups !== null) {
      const skole = await fintInstance.getData(dataMapper.skoleUrl(elevforhold))

      const elev = await fintInstance.getData(dataMapper.elevUrl(elevforhold))

      const person = await fintInstance.getData(dataMapper.personUrl(elev))

      send(response, 200, await dataMapper.StudentGroup(elev, person, skole, groups))
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

    function getAsync(elevforholdUrl) {
      return new Promise(async (resolve, reject) => {

          const elevforhold = await fintInstance.getData(elevforholdUrl)
          const elev = await fintInstance.getData(dataMapper.elevUrl(elevforhold))
          const person = await fintInstance.getData(dataMapper.personUrl(elev))
          
          resolve( dataMapper.Student(elev, person))
      })
    } 

    let promises = dataMapper.memberUrls(group).map(elevforholdUrl => {
        return getAsync(elevforholdUrl)
        .then(student => {
            return student
        })
    });

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
    const personalressurs = await fintInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/brukernavn/' + username)
    const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

    dataMapper.contactGroupsUrls(undervisningsforhold).map( async contactGroupUrl => {
      const contactGroup = await fintInstance.getData(contactGroupUrl)
      return dataMapper.contactClass(contactGroup)
    })
    
    send(response, 200, await contactGroups)
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.contactTeachers = async (request, response) => {
  const { username } = request.params
  logger('info', ['routes', 'contactTeachers', 'username', username])
  try {
    const fintInstance = await fint()

    const elev = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/elev/brukernavn/' + username)
    const elevforhold = await fintInstance.getData(dataMapper.elevforholdUrl(elev))

    const contactTeachers = []

    for (const contactGroupUrl of dataMapper.contactGroupsUrls(elevforhold)) {
      const contactGroup = await fintInstance.getData(contactGroupUrl)
      for (const undervisningsforholdUrl of dataMapper.undervisningsforholdUrls(contactGroup)) {
        const undervisningsforhold = await fintInstance.getData(undervisningsforholdUrl)
        const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(undervisningsforhold))
        const personalressurs = await fintInstance.getData(dataMapper.personalressursUrl(skoleressurs))
        contactTeachers.push(dataMapper.contactTeacher(personalressurs, contactGroup))
      }
    }
    send(response, 200, await contactTeachers)
  } catch (error) {
    sendError(request, response, error)
  }
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  try {
    const fintInstance = await fint()

    const undervisningsforholds = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/undervisningsforhold/')

    function getAsync(undervisningsforhold) {
      return new Promise(async (resolve, reject) => {

        const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(undervisningsforhold))
        const personalressurs = await fintInstance.getData(dataMapper.personalressursUrl(skoleressurs))
        const person = await fintInstance.getData(dataMapper.personUrl(personalressurs))
        const skole = await fintInstance.getData(dataMapper.skoleUrl(skoleressurs))
          
          resolve( dataMapper.Teacher(personalressurs, person, skole))
      })
    } 

    let promises = undervisningsforholds.map(undervisningsforhold => {
        return getAsync(undervisningsforhold)
        .then(teacher => {
            return teacher
        })
    });

    Promise.all(promises).then((teachers) => send(response, 200, teachers))
  } catch (error) {
    sendError(request, response, error)
  }
}
