exports.studentGroup = (elev, person, skole, groups) => (
  [
    {
      firstName: person.navn.fornavn,
      middleName: person.navn.mellomnavn || null,
      lastName: person.navn.etternavn,
      fullName: person.navn.fornavn + ' ' + person.navn.etternavn,
      personalIdNumber: person.fodselsnummer.identifikatorverdi,
      mobilePhone: person.kontaktinformasjon.mobiltelefonnummer,
      mail: person.kontaktinformasjon.epostadresse,
      userName: elev.brukernavn.identifikatorverdi,
      contactTeacher: false,
      unitId: skole.systemId.identifikatorverdi,
      unitName: skole.organisasjonsnavn,
      organizationNumber: skole.organisasjonsnummer.identifikatorverdi,
      mainGroupName: '---------',
      groups: groups
    }
  ]
)

exports.group = (skole, group) => (
  [
    {
      id: group.what, // what is this?
      description: group.what, // what is this?
      unitId: skole.systemId.identifikatorverdi,
      unitName: skole.organisasjonsnavn,
      organizationNumber: skole.organisasjonsnummer.identifikatorverdi,
      contactTeacher: '--------------' // when is this true or false?
    }
  ]
)

exports.student = (elev, person) => (
  {
    firstName: person.navn.fornavn,
    middleName: person.navn.mellomnavn || null,
    lastName: person.navn.etternavn,
    fullName: person.navn.fornavn + ' ' + person.navn.etternavn,
    personalIdNumber: person.fodselsnummer.identifikatorverdi,
    mobilePhone: person.kontaktinformasjon.mobiltelefonnummer || null,
    mail: person.kontaktinformasjon.epostadresse || null,
    userName: null
  }
)

exports.teacher = (personalressurs, person, skole) => (
  [
    {
      firstName: person.navn.fornavn,
      middleName: person.navn.mellomnavn || null,
      lastName: person.navn.etternavn,
      fullName: person.navn.fornavn + ' ' + person.navn.etternavn,
      username: personalressurs.brukernavn.identifikatorverdi,
      personalIdNumber: person.fodselsnummer.identifikatorverdi,
      mobilePhone: personalressurs.kontaktinformasjon.mobiltelefonnummer || null,
      mail: personalressurs.kontaktinformasjon.epostadresse || null,
      privateMail: person.kontaktinformasjon.epostadresse || null,
      department: '-----------', // is this the school?
      organizationNumber: skole.organisasjonsnummer.identifikatorverdi
    }
  ]
)

exports.contactTeacher = (personalressurs, contactGroup) => (
  {
    username: personalressurs.brukernavn.identifikatorverdi,
    groupId: contactGroup.systemId.identifikatorverdi, // what id
    mail: personalressurs.kontaktinformasjon.epostadresse
  }
)

exports.contactClass = contactClass => (
  {
    id: contactClass.navn // or contactClass.systemId.identifikatorverdi
  }
)

exports.allGroupUrls = forhold => {
  try {
    const kontaktlarergrupper = forhold._links.kontaktlarergruppe
      ? forhold._links.kontaktlarergruppe.map(({ href }) => href)
      : []

    const basisgrupper = forhold._links.basisgruppe
      ? forhold._links.basisgruppe.map(({ href }) => href)
      : []
    const undervisningsgrupper = forhold._links.undervisningsgruppe
      ? forhold._links.undervisningsgruppe.map(({ href }) => href)
      : []

    return [ ...kontaktlarergrupper, ...basisgrupper, ...undervisningsgrupper ].filter(item => item)
  } catch (e) {
    return []
  }
}

exports.personUrl = elev => elev._links.person[0].href

exports.elevforholdUrl = elev => elev._links.elevforhold[0].href

exports.elevUrl = elevforhold => elevforhold._links.elev[0].href

exports.skoleUrl = elevforhold => elevforhold._links.skole[0].href

exports.memberUrls = group => {
  try {
    return group._links.elevforhold.map(({ href }) => href)
  } catch (e) {
    return []
  }
}
exports.skoleressursUrl = personalressurs => personalressurs._links.skoleressurs[0].href

exports.undervisningsforholdUrl = skoleressurs => skoleressurs._links.undervisningsforhold[0].href

exports.personalressursUrl = skoleressurs => skoleressurs._links.personalressurs[0].href

exports.undervisningsforholdUrls = group => {
  try {
    return group._links.undervisningsforhold.map(({ href }) => href)
  } catch (e) {
    return []
  }
}

exports.contactGroupsUrls = forhold => {
  try {
    return forhold._links.kontaktlærergruppe.map(({ href }) => href)
  } catch (e) {
    return []
  }
}
