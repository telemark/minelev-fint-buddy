module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  FINT_AUTH_URL: process.env.FINT_AUTH_URL || 'https://fint.auth.io',
  skoleOptions: {
    FINT_EXTENS_CLIENT_ID: process.env.FINT_EXTENS_CLIENT_ID || 'minelev-fint-buddy',
    FINT_EXTENS_CLIENT_SECRET: process.env.FINT_EXTENS_CLIENT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
    FINT_EXTENS_AUTH_USERNAME: process.env.FINT_EXTENS_AUTH_USERNAME || 'minelev-fint-buddy',
    FINT_EXTENS_AUTH_PASSWORD: process.env.FINT_EXTENS_AUTH_PASSWORD || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
    FINT_EXTENS_ORG_ID: process.env.FINT_EXTENS_ORG_ID || 'fint@fint.io'
  },
  personalOptions: {
    FINT_VISMA_CLIENT_ID: process.env.FINT_VISMA_CLIENT_ID || 'minelev-fint-buddy',
    FINT_VISMA_CLIENT_SECRET: process.env.FINT_VISMA_CLIENT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
    FINT_VISMA_AUTH_USERNAME: process.env.FINT_VISMA_AUTH_USERNAME || 'minelev-fint-buddy',
    FINT_VISMA_AUTH_PASSWORD: process.env.FINT_VISMA_AUTH_PASSWORD || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
    FINT_VISMA_ORG_ID: process.env.FINT_VISMA_ORG_ID || 'fint@fint.io'
  },
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-fint-buddy',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
