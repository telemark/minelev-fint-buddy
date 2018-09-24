const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { send } = require('micro')
const logger = require('./logger')

const fint = require('./fint-client')
const dataMapper = require('./data-mapper')


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

  try {
    const fintInstance = await fint()

    const personalressurs = await fintInstance.getData('https://beta.felleskomponent.no/administrasjon/personal/personalressurs/brukernavn/' + username)
    const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(personalressurs))
    const undervisningsforhold = await fintInstance.getData(dataMapper.undervisningsforholdUrl(skoleressurs))

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
    throw error
  }
}

exports.students = async (request, response) => {
  const { groupId } = request.params
  logger('info', ['routes', 'students', 'groupId', groupId])

  try {
    const fintInstance = await fint()
    
    const group = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/basisgruppe/systemid/' + groupId)
  
    const students = []
    let howMany = 2
    
    for (const memberUrl of dataMapper.memberUrls(group)) {
      const elevforhold = await fintInstance.getData(memberUrl)
      const elev = await fintInstance.getData(dataMapper.elevUrl(elevforhold))
      const person = await fintInstance.getData(dataMapper.personUrl(elev))
      students.push(dataMapper.Student(elev, person))
      howMany = howMany + 3
    }
    console.log(howMany)
    
    send(response, 200, await students)
  } catch (error) {
    throw error
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
    
    const contactGroups = []

    for (const contactGroupUrl of dataMapper.contactGroupsUrls(undervisningsforhold)) {
      const contactGroup = await fintInstance.getData(contactGroupUrl)
      contactGroups.push(dataMapper.contactClass(contactGroup))
    }
    send(response, 200, await contactGroups)
  } catch (error) {
    throw error
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
    throw error
  }
}

exports.teachers = async (request, response) => {
  logger('info', ['routes', 'teachers'])
  try {
    const fintInstance = await fint()

    const undervisningsforholds = await fintInstance.getData('https://beta.felleskomponent.no/utdanning/elev/undervisningsforhold/')
    
    const Teachers = []

    for (const undervisningsforhold of undervisningsforholds) {
      const skoleressurs = await fintInstance.getData(dataMapper.skoleressursUrl(undervisningsforhold))
      const personalressurs = await fintInstance.getData(dataMapper.personalressursUrl(skoleressurs))
      const person = await fintInstance.getData(dataMapper.personUrl(personalressurs))
      const skole = await fintInstance.getData(dataMapper.skoleUrl(skoleressurs))

      Teachers.push(dataMapper.Teacher(personalressurs, person, skole))
    }
    send(response, 200, await Teachers)
  } catch (error) {
    throw error
  }
}