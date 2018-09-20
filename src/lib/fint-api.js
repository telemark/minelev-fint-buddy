const fint = require('./fint-client')
const getData = require('fint-get-data')
const logger = require('./logger')
const mapper = require('./data-mapper')




exports.getStudent = async(username, id) => {
  try {
    const fintInstance = await fint()
    const token = fintInstance.getToken()

    const teacher = await getData('https://play-with-fint.felleskomponent.no/utdanning/elev/skoleressurs/feidenavn/' + username, token, 'telemark.no')
    const undervisningsforhold_url = await mapper.undervisningsforholdUrl(teacher)

    const elevforhold = await getData('https://play-with-fint.felleskomponent.no/utdanning/elev/elevforhold/systemid/' + id, token, 'telemark.no')

    const groups = await mapper.groups(elevforhold)
    groups.map(async (group, i) => {
      groups[i] = await getData(group['href'], token, 'telemark.no')
    })

    const skole = await getData(mapper.skoleUrl(elevforhold), token, 'telemark.no')
    
    const elev = await getData(mapper.elevUrl(elevforhold), token, 'telemark.no')

    const person = await getData(mapper.personUrl(elev), token, 'telemark.no')

    const response = await mapper.groupStudent(elev, person, skole, groups)

    return teacher
  } catch (error) {
    logger('error', ['fint-api-error', error])
  }
}
exports.getStudents = async(groupId) => {
  try {
    const fintInstance = await fint()
    const token = fintInstance.getToken()
    const students = []
    const group = await getData('https://play-with-fint.felleskomponent.no/utdanning/elev/basisgruppe/systemid/' + groupId, token, 'telemark.no')

    const memberships = await mapper.membersUrls(group)
  
    for (const membership of memberships) {
      const member = await getData(membership, token, 'telemark.no')
      const relationship = await getData( await mapper.memberUrl(member), token, 'telemark.no')
      //check if member is elev, else skip
      if (relationship ['_links']['elev'] === undefined) {
        continue
      }
      const student = await getData( await mapper.elevUrl(relationship), token, 'telemark.no')
      const person = await getData( await mapper.personUrl(student), token, 'telemark.no')
      students.push(await mapper.Student(student, person))
    }

    return await students
  } catch (error) {
    logger('error', ['fint-api-error', error])
  }
}

exports.getTest = async() => {
  try {
    const fintInstance = await fint()
    const token = fintInstance.getToken()
    const data = await getData('https://play-with-fint.felleskomponent.no/utdanning/elev/elev', token, 'telemark.no')
    return data
  } catch (error) {
    logger('error', ['fint-api-error', error])
  }
}