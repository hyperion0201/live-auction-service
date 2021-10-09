import jwt from 'jsonwebtoken'
import get from 'lodash/get'
import {JWT_SECRET} from '../configs'
import {getUser, isAdmin} from '../services/user'
import {HTTP_STATUS_CODES} from '../utils/constants'
import * as enums from '../utils/constants'
import ServerError from '../utils/custom-error'

function extractTokenFromRequest(req) {
  const authHeader = get(req, 'headers.authorization')
  return authHeader && authHeader.split(' ')[1]
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) reject(err)
      resolve(user)
    })
  })

}

export function authenticate(options = {}) {
  const {requiredAdmin = false} = options

  return async (req, res, next) => {
    const token = extractTokenFromRequest(req)

    if (!token) {
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
        message: 'Unauthorized.'
      })
    }
    
    try {
      const payload = await verifyToken(token)
      const user = await getUser({
        where: {
          id: payload.id
        }
      })
      if (!user) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
          message: 'User not found. Please re login.'
        })
      }

      if (requiredAdmin) {
        if (!await isAdmin(user)) {
          return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
            message: 'Required admin.'
          })
        }
      }
      
      // reject disabled user
      if (user.status === enums.USER_STATUS.DISABLED) {
        return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
          message: 'Your account was disabled.'
        })
      }

      req.user = user
      return next()
    }
    catch (err) {
      next(new ServerError({
        name: 'Invalid or expired token.',
        err
      }))
    }
  }
}

export function requireStatusRole() {
  return async (req, res, next) => {
    const {role = '', status = ''} = get(req, 'body')
    const StatusArray = [enums.USER_STATUS.DISABLED, enums.USER_STATUS.VERIFIED]
    const RoleUserArray = [enums.USER_ROLES.ADMIN, enums.USER_ROLES.USER]

    if (!StatusArray.includes(status)) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message: 'invalid status'})
    }
    if (!RoleUserArray.includes(role)) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message: 'invalid role'})
    }
    
    next()
  }
}
