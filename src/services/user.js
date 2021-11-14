import get from 'lodash/get.js'
import isNumber from 'lodash/isNumber.js'
import User from '../models/user.js'
import * as enums from '../utils/constants.js'
import ServerError from '../utils/custom-error.js'
import {hashPasswordSync} from '../utils/password.js'

export async function createUser(payload = {}, opts = {}) {
  const {password} = payload
  const {setVerified = false} = opts
  try {
    const hashed = password ? hashPasswordSync(password) : null
    return await User.create({
      ...payload,
      password: hashed,
      role: enums.USER_ROLES.BIDDER,
      status: setVerified ? enums.USER_STATUS.VERIFIED : enums.USER_STATUS.NOT_VERIFIED
    })
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create user.', err})
  }
}

export async function getUser(opts = {}) {
  const queryObj = {...opts}

  try {
    return await User.findOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when find user.', err})
  }
}

export async function isUserWithEmailExist(userEmail) {
  try {
    return await User.findOne({email: userEmail})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when check user exists.', err})
  }
}

export async function getAllUsers(opts = {}) {
  const queryObj = {...opts}

  try {
    return await User.find(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all users.', err})
  }
}

export async function updateUser(opts = {}, payload) {
  delete payload.password
  const queryObj = {...opts}

  try {
    return await User.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({
      name: 'Something error when update user.',
      err
    })
  }
}

export async function deleteUser(opts = {}) {
  const queryObj = {...opts}

  try {
    return await User.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({
      name: 'Something error when delete user.', err
    })
  }
}

export async function updatePassword(opts = {}, newPassword) {
  // hash password
  const hashed = hashPasswordSync(newPassword)
  const queryObj = {...opts}

  try {
    return await User.updateOne(queryObj, {password: hashed})
  }
  catch (err) {
    throw new ServerError({
      name: 'Something error when update password.',
      err
    })
  }
}

export async function isAdmin(userOrId) {
  let userObj = userOrId
  if (isNumber(userOrId)) {
    userObj = await getUser({_id: userOrId})
  }

  return get(userObj, 'role') === enums.USER_ROLES.ADMIN
}
