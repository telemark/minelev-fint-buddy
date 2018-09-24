module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-fint-buddy',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345,
  fint: {
    url: '***REMOVED***',
    credentials: {
      client: {
        client_id: '***REMOVED***',
        client_secret: '***REMOVED***'
      },
      auth: {
        username: '***REMOVED***',
        password: '***REMOVED***',
        grant_type: 'password',
        scope: 'fint-client'
      }
    },
    orgId: 'telemark.no'
  }
}
