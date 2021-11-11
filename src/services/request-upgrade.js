import RequestUpgrade from '../models/request-upgrade'
import ServerError from '../utils/custom-error'

export async function create(payload = {}) {
  try {
    return await RequestUpgrade.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create request upgrade.', err})
  }
}

export async function getById(opts = {}) {
  const queryObj = {...opts}

  try {
    return await RequestUpgrade.findOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail request upgrade.', err})
  }
}

export async function getRequestsUpgrade(opts = {}) {
  const queryObj = {...opts}

  try {
    return await RequestUpgrade.find(queryObj).populate('createBy')
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all request upgrade.', err})
  }
}

export async function updateOneRequestUpgrade(opts = {}, payload) {
  const queryObj = {...opts}

  try {
    return await RequestUpgrade.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update request upgrade.', err})
  }
}

export async function deleteOneRequestUpgrade(opts = {}) {
  const queryObj = {...opts}

  try {
    return await RequestUpgrade.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete request upgrade.', err})
  }
}
