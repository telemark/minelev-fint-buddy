exports.groupStudent = async(elev, person, skole, groups) => {

    const student = [
        {
            firstName: person['navn']['fornavn'],
            middleName: person['navn']['mellomnavn'] || null,
            lastName: person['navn']['etternavn'],
            fullName: person['navn']['fornavn'] + ' ' + person['navn']['etternavn'],
            personalIdNumber: person['fodselsnummer']['identifikatorverdi'],
            mobilePhone: person['kontaktinformasjon']['mobiltelefonnummer'],
            mail: person['kontaktinformasjon']['epostadresse'],
            userName: elev['brukernavn']['identifikatorverdi'],
            contactTeacher: false,
            unitId: skole['systemId']['identifikatorverdi'],
            unitName: skole['organisasjonsnavn'],
            organizationNumber: skole['organisasjonsnummer']['identifikatorverdi'],
            mainGroupName: '---------',
            groups: groups
        }
    ]
    return student

}
exports.Student = async(elev, person, skole, groups) => {

    const student = [
        {
            firstName: person['navn']['fornavn'],
            middleName: person['navn']['mellomnavn'] || null,
            lastName: person['navn']['etternavn'],
            fullName: person['navn']['fornavn'] + ' ' + person['navn']['etternavn'],
            personalIdNumber: person['fodselsnummer']['identifikatorverdi'],
            mobilePhone: person['kontaktinformasjon']['mobiltelefonnummer'] || null,
            mail: person['kontaktinformasjon']['epostadresse'] || null,
            userName: elev['brukernavn']['identifikatorverdi']
        }
    ]
    return student

}
exports.undervisningsforholdUrl = async(teacher) => {
    return teacher['_links']['undervisningsforhold'][0]['href']
}
exports.personUrl = async(elev) => {
    return elev['_links']['person'][0]['href']
}
exports.elevUrl = async(elevforhold) => {
    return elevforhold['_links']['elev'][0]['href']
}
exports.skoleUrl = async(elevforhold) => {
    return elevforhold['_links']['skole'][0]['href']
}
exports.memberUrl = async(relation) => {
    return relation['_links']['medlem'][0]['href']
}
exports.membersUrls = async(group) => {
    const memberLinks = []
    for (const member of group['_links']['medlemskap']) {
        memberLinks.push(member['href'])
    }
    return memberLinks
}
exports.groups = async(elevforhold) => {
    return elevforhold['_links']['medlemskap']
}