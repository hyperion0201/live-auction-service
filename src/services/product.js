import Product from '../models/product.js'
import ServerError from '../utils/custom-error'

export async function createProduct(payload = {}, opts = {}) {
  try {
    return await Product.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create bidding product.', err})
  }
}

export async function getProduct(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await Product.findOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail bidding product.', err})
  }
}
  
export async function getAllProduct(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await Product.find(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding product.', err})
  }
}
  
export async function updateProduct(opts = {}, payload) {
  const queryObj = {...opts}
  
  try {
    return await Product.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update bidding product.', err})
  }
}
  
export async function deleteProduct(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await Product.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete bidding product.', err})
  }
}
