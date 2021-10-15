import Category from '../models/category'
import ServerError from '../utils/custom-error'

export async function addNew(payload = {}, opts = {}) {
  try {
    return await Category.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create category.', err})
  }
}

export async function getByID(opts = {}) {
  const queryObj = {...opts}

  try {
    return await Category.findOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail category.', err})
  }
}

export async function getCategories(opts = {}) {
  const queryObj = {...opts}

  try {
    return await Category.find(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all category.', err})
  }
}

export async function updateOneCategory(opts = {}, payload) {
  const queryObj = {...opts}

  try {
    return await Category.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update category.', err})
  }
}

export async function deleteOneCategory(opts = {}) {
  const queryObj = {...opts}

  try {
    return await Category.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete category.', err})
  }
}
