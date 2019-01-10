[![Build Status](https://travis-ci.com/telemark/minelev-fint-buddy.svg?branch=master)](https://travis-ci.com/telemark/minelev-fint-buddy)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# minelev-fint-buddy

API mimicking the buddy api for FINT with a few add ons

## setup

config [production.env](production.env) for your environment

```bash
JWT_SECRET=secret-for-accessing-this-api
FINT_AUTH_URL=fint-auth-url
FINT_EXTENS_CLIENT_ID=fint-client-id-for-extens-client
FINT_EXTENS_CLIENT_SECRET=fint-client-secret-for-extens-client
FINT_EXTENS_AUTH_USERNAME=fint-client-username-for-extens-client
FINT_EXTENS_AUTH_PASSWORD=fint-client-password-for-extens-client
FINT_EXTENS_ORG_ID=organization-for-extens-fint-access
FINT_VISMA_CLIENT_ID=fint-client-id-for-visma-client
FINT_VISMA_CLIENT_SECRET=fint-client-secret-for-extens-client
FINT_VISMA_AUTH_USERNAME=fint-client-username-for-visma-client
FINT_VISMA_AUTH_PASSWORD=fint-client-password-for-visma-client
FINT_VISMA_ORG_ID=organization-for-visma-fint-access
```

### Example result from ```/users/{username}/search/{search}```

Returns students and which classes the teacher (username) has a relation to.
```JavaScript
[
 {
    "firstName": "Helga",
    "middleName": null,
    "lastName": "Durk",
    "fullName": "Helga Durk",
    "personalIdNumber": "02059711111",
    "mobilePhone": "+4798888888",
    "mail": "helgad@hotmail.com",
    "userName": "0205helgdurk",
    "contactTeacher": false,
    "unitId": "BAMVS",
    "unitName": "Bamble vgs. avd. Grasmyr",
    "organizationNumber": "NO974568098",
    "mainGroupName": "BAMVS:3ST",
    "groups": [
      {
        "id": "BAMVS:3ST/151FSP5098",
        "description": "Spansk I+II",
        "unitId": "BAMVS",
        "unitName": "Bamble vgs. avd. Grasmyr",
        "organizationNumber": "NO974568098",
        "contactTeacher": false
      }
    ]
 },
 {
    "firstName": "Halgrim",
    "middleName": "",
    "lastName": "Durk",
    "fullName": "Halgrim Durk",
    "personalIdNumber": "02109911111",
    "mobilePhone": "+4741111111",
    "mail": "halgrimdurk@gmail.com",
    "userName": "0101durk",
    "contactTeacher": true,
    "unitId": "BAMVS",
    "unitName": "Bamble vgs. avd. Grasmyr",
    "organizationNumber": "NO974568098",
    "mainGroupName": "BAMVS:1ST",
    "groups": [
      {
        "id": "BAMVS:1ST/151FSP5091",
        "description": "Spansk I, 1. år",
        "unitId": "BAMVS",
        "unitName": "Bamble vgs. avd. Grasmyr",
        "organizationNumber": "NO974568098",
        "contactTeacher": true
      }
    ]
  }
]
```

### Example results from ```/users/{username}/students/{id}```

Return given student that teacher has relation to.
```JavaScript
[
  {
    "firstName": "Helge Grim",
    "middleName": null,
    "lastName": "Grim",
    "fullName": "Helge Grim",
    "personalIdNumber": "02059711111",
    "mobilePhone": "+4798888888",
    "mail": "helgeg@hotmail.com",
    "userName": "0205helgeg",
    "contactTeacher": false,
    "unitId": "BAMVS",
    "unitName": "Bamble vgs. avd. Grasmyr",
    "organizationNumber": "NO974568098",
    "mainGroupName": "BAMVS:3ST",
    "groups": [
      {
        "id": "BAMVS:3ST/151FSP5098",
        "description": "Spansk I+II",
        "unitId": "BAMVS",
        "unitName": "Bamble vgs. avd. Grasmyr",
        "organizationNumber": "NO974568098",
        "contactTeacher": false
      }
    ]
  }
]
```

### Example results from ```/groups/{groupId}/students```

Return students in given group
```JavaScript
[
  {
    "firstName": "Helge",
    "middleName": null,
    "lastName": "Grim",
    "fullName": "Helge Grim",
    "personalIdNumber": "02059711111",
    "mobilePhone": "+4748300000",
    "mail": null,
    "userName": "0903grim"
  },
  {
    "firstName": "Halgrim",
    "middleName": null,
    "lastName": "Durk",
    "fullName": "Halgrim Durk",
    "personalIdNumber": "02059711112",
    "mobilePhone": "+4748300000",
    "mail": "halgrim.durk@hotmail.com",
    "userName": "1010halg"
  }
 ]
```

### Example results from ```/users/{username}/contactClasses```

Return a teachers contact classes
```JavaScript
[
  {
    "Id": "KRAVS:2REA"
  }
]
```

### Example results from ```/users/{username}/contactTeachers```

Return given students contact teachers
```JavaScript
[
  {
    "username": "jantejante",
    "groupId": "KRAVS:3REA",
    "mail": "jante@t-fk.no"
  }
]
```

### Example results from ```/teachers/all```

Returns all teachers


```JavaScript
[
  {
    "firstName": "Testine",
    "middleName": null,
    "lastName": "Testen",
    "fullName": "Testine Testen",
    "username": "01016101",
    "personalIdNumber": "01016145048",
    "mobilePhone": null,
    "mail": "Testine.Testen@t-fk.no",
    "privateMail": "Geir.Gasodden@t-fk.no",
    "department": "SKIVS",
    "organizationNumber": "974568039"
  }
]
```

### Example results from ```/students/all```

Returns all students

```JavaScript
[
  {
    "systemId": "726FFDA0B73B121DE0531833800A007B",
    "mobilePhone": "+4748300000",
    "mail": null,
    "userName": "0903grim"
    "personalIdNumber": "02059711111",
  },
  {
    "systemId": "726EF07244A70738E0531833800AA8CE",
    "mobilePhone": "+4748300000",
    "mail": "halgrim.durk@hotmail.com",
    "userName": "1010halg"
    "personalIdNumber": "02059711112",
  }
 ]
```


## Related

- [buddy-minelev-api](https://github.com/telemark/buddy-minelev-api) The original MinElev Buddy API
- [FINT](https://www.fintprosjektet.no) The FINT project

## License

[MIT](LICENSE)
