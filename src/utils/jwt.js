import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '../configs.js'

export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '12h'
  })
}
