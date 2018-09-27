exports.StudentGroup = async (elev, person, skole, groups) => {
  const data = [
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
  return data
}

exports.Group = (skole, group) => {
  const data = [
    {
      id: group.what, // what is this?
      description: group.what, // what is this?
      unitId: skole.systemId.identifikatorverdi,
      unitName: skole.organisasjonsnavn,
      organizationNumber: skole.organisasjonsnummer.identifikatorverdi,
      contactTeacher: '--------------' // when is this true or false?
    }
  ]
  return data
}

exports.Student = (elev, person) => {

  const data = {
    firstName: person.navn.fornavn,
    middleName: person.navn.mellomnavn || null,
    lastName: person.navn.etternavn,
    fullName: person.navn.fornavn + ' ' + person.navn.etternavn,
    personalIdNumber: person.fodselsnummer.identifikatorverdi,
    mobilePhone: person.kontaktinformasjon.mobiltelefonnummer || null,
    mail: person.kontaktinformasjon.epostadresse || null,
    userName: null
  }
  return data
}

exports.Teacher = (personalressurs, person, skole) => {
  const data = [
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
  return data
}

exports.contactTeacher = (personalressurs, contactGroup) => {
  const data = 
    {
      username: personalressurs.brukernavn.identifikatorverdi,
      groupId: contactGroup.systemId.identifikatorverdi, // what id
      mail: personalressurs.kontaktinformasjon.epostadresse
    }
  
  return data
}

exports.contactClass = contactClass => {
  const contactClassId =
    {
      id: contactClass.navn // or contactClass.systemId.identifikatorverdi
    }
  
  return contactClassId
}

exports.allGroupUrls = forhold => {
  const Urls = []
  if (forhold._links.kontaktlarergruppe) {
    for (const kontaktlarergruppe of group._links.kontaktlarergruppe) {
      Urls.push(kontaktlarergruppe.href)
    }
  }
  if (forhold._links.basisgruppe) {
    for (const basisgruppe of group._links.basisgruppe) {
      Urls.push(basisgruppe.href)
    }
  }
  if (forhold._links.undervisningsgruppe) {
    for (const undervisningsgruppe of group._links.undervisningsgruppe) {
      Urls.push(undervisningsgruppe.href)
    }
  }
  return Urls
}

exports.personUrl = elev => {
  return elev._links.person[0].href
}
exports.elevforholdUrl = elev => {
  return elev._links.elevforhold[0].href
}
exports.elevUrl = elevforhold => {
  return elevforhold._links.elev[0].href
}
exports.skoleUrl = elevforhold => {
  return elevforhold._links.skole[0].href
}
exports.memberUrls = group => {
  const memberUrls = []
  for (const member of group._links.elevforhold) {
    memberUrls.push(member.href)
  }
  return memberUrls
}
exports.skoleressursUrl = personalressurs => {
  return personalressurs._links.skoleressurs[0].href
}
exports.undervisningsforholdUrl = skoleressurs => {
  return skoleressurs._links.undervisningsforhold[0].href
}
exports.personalressursUrl = skoleressurs => {
  return skoleressurs._links.personalressurs[0].href
}
exports.undervisningsforholdUrls = group => {
  const undervisningsforholdUrls = []
  for (const undervisningsforhold of group._links.undervisningsforhold) {
    undervisningsforholdUrls.push(undervisningsforhold.href)
  }
  return undervisningsforholdUrls
}
exports.contactGroupsUrls = forhold => {
  const contactGroupsUrls = []
  for (const group of forhold._links.kontaktlærergruppe) {
    contactGroupsUrls.push(group.href)
  }
  return contactGroupsUrls
}
