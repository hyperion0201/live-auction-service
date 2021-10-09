import bcrypt from 'bcrypt'

const SALT_ROUND = 10

export function hashPasswordSync(password) {
  return bcrypt.hashSync(password, SALT_ROUND)
}

export function verifyPasswordSync(password, hashed) {
  return bcrypt.compareSync(password, hashed)
}

export function generateResetPassword() {
  return Math.random().toString(36).substring(3)
}
