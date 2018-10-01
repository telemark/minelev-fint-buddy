exports.StudentGroup = (elev, person, skole, groups) => (
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

exports.Group = (skole, group) => (
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

exports.Student = (elev, person) => (
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

exports.Teacher = (personalressurs, person, skole) => (
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
  const urls = []
  if (forhold._links.kontaktlarergruppe) {
    for (const kontaktlarergruppe of forhold._links.kontaktlarergruppe) {
      urls.push(kontaktlarergruppe.href)
    }
  }
  if (forhold._links.basisgruppe) {
    for (const basisgruppe of forhold._links.basisgruppe) {
      urls.push(basisgruppe.href)
    }
  }
  if (forhold._links.undervisningsgruppe) {
    for (const undervisningsgruppe of forhold._links.undervisningsgruppe) {
      urls.push(undervisningsgruppe.href)
    }
  }
  return urls
}

exports.personUrl = elev => elev._links.person[0].href

exports.elevforholdUrl = elev => elev._links.elevforhold[0].href

exports.elevUrl = elevforhold => elevforhold._links.elev[0].href

exports.skoleUrl = elevforhold => elevforhold._links.skole[0].href

exports.memberUrls = group => {
  const memberUrls = []
  for (const member of group._links.elevforhold) {
    memberUrls.push(member.href)
  }
  return memberUrls
}
exports.skoleressursUrl = personalressurs => personalressurs._links.skoleressurs[0].href

exports.undervisningsforholdUrl = skoleressurs => skoleressurs._links.undervisningsforhold[0].href

exports.personalressursUrl = skoleressurs => skoleressurs._links.personalressurs[0].href

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
