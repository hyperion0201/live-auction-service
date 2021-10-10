import keyMirror from 'keymirror'

export const USER_ROLES = keyMirror({
  ADMIN: null,
  USER: null,
  SELLER: null,
  BIDDER: null
})

export const USER_STATUS = keyMirror({
  VERIFIED: null,
  NOT_VERIFIED: null,
  DISABLED: null
})

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  OK: 200
}
