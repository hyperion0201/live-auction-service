/* eslint-disable node/no-deprecated-api */

import cryptoNode from 'crypto'

// Algorithm to create cipher. The selected algorithm must
// be secure and have native implementation in OSX and Linux.
const ENCRYPTION_ALGORITHM = 'seed'

export function encrypt(payload, secret) {
  // Create the secure token
  const cipher = cryptoNode.createCipher(ENCRYPTION_ALGORITHM, secret)

  // Use 'hex' encoding for URI-encoding compatibility
  const token = cipher.update(JSON.stringify(payload), 'utf8', 'hex') +
    cipher.final('hex')

  return token
}

export function decrypt(token, secret) {
  const decipher = cryptoNode.createDecipher(ENCRYPTION_ALGORITHM, secret)
  let payloadText

  try {
    payloadText = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8')
  }
  catch (err) {
    throw new Error('Invalid token')
  }

  return JSON.parse(payloadText)
}
