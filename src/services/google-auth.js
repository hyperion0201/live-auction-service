import {google} from 'googleapis'
import {
  SERVER_PORT, JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} from '../configs'
import ServerError from '../utils/custom-error'

const OAuth2 = google.auth.OAuth2

const baseUrl = 'https://wiflyhomework.com/exam-api'

const GOOGLE_OAUTH2_CONFIGURATION = {
  JWTsecret: JWT_SECRET,
  baseURL: baseUrl,
  port: SERVER_PORT,
  oauth2Credentials: {
    client_id: GOOGLE_CLIENT_ID,
    project_id: 'basic-exam-service-auth',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uris: [
      `${baseUrl}/v1/auth/google/callback`
    ],
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  }
}

export default class GoogleOAuth2 {
  constructor(options = {}) {
    // Create an OAuth2 client object from the credentials in our config file.
    this._oAuth2Client = new OAuth2({
      clientId: GOOGLE_OAUTH2_CONFIGURATION.oauth2Credentials.client_id,
      clientSecret: GOOGLE_OAUTH2_CONFIGURATION.oauth2Credentials.client_secret,
      redirectUri: GOOGLE_OAUTH2_CONFIGURATION.oauth2Credentials.redirect_uris[0]
    })

    this._apiClient = null
    this.options = options
  }

  generateLoginUrl() {
    return this._oAuth2Client.generateAuthUrl({
      // Indicates that we need to be able to access data continously
      // without the user constantly giving us consent
      access_type: 'offline',
      // Using the access scopes from our config file
      scope: GOOGLE_OAUTH2_CONFIGURATION.oauth2Credentials.scopes
    })
  }

  // set credential with token response that retrieved from getToken function.
  setCredentials(tokenResponse) {
    this._oAuth2Client.setCredentials(tokenResponse.tokens)
  }
  
  async getToken(authorizationCode) {
    try {
      return await this._oAuth2Client.getToken(authorizationCode)
    }
    catch (err) {
      throw new ServerError({
        name: 'Error when get token info from authorization code.',
        err
      })
    }
  }
  
  _getApiClient() {
    if (!this._apiClient) {
      this._apiClient = google.oauth2({
        auth: this._oAuth2Client,
        version: 'v2'
      })
    }
    
    return this._apiClient
  }

  async getUserInfo(options = {}) {
    try {
      const apiClient = this._getApiClient()
      return await apiClient.userinfo.get(options)
    }
    catch (err) {
      throw new ServerError({
        name: 'Error when get Google user info.',
        err
      })
    }
  }
}
