import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '../configs'

export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '12h'
  })
}
