/* eslint-disable max-len */
// declare env variables that required for app

export const SERVER_PORT = Number(process.env.SERVER_PORT) || 5001

export const DEBUGGING_ENABLED = process.env.DEBUGGING_ENABLED === 'true'

export const DB_LOGGING_ENABLED = process.env.DB_LOGGING_ENABLED === 'true'

export const ROOT_APP_NAMESPACE = process.env.ROOT_APP_NAMESPACE || 'server'

export const JWT_SECRET = process.env.JWT_SECRET || 'slowdancingintheburningroom'

export const DB_HOST = process.env.DB_HOST || 'localhost'

export const DB_USER = process.env.DB_USER || 'hyperion0201'

export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres'

export const DB_NAME = process.env.DB_NAME || 'liveauction'

export const DB_PORT = Number(process.env.DB_PORT) || 5432

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'google-client-id'

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret'

export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || 'dump-email'

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '123456'

export const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || 'waitingontheworldtochange'

export const BASE_API_URL = process.env.BASE_API_URL || 'localhost:' + SERVER_PORT
