import ProductDescription from '../models/product-description.js'
import ServerError from '../utils/custom-error.js'

export async function createProductDescription(payload = {}, opts = {}) {
  try {
    return await ProductDescription.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create product description.', err})
  }
}

export async function getProductDescription(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await ProductDescription.findOne(queryObj)
      .populate({
        path: 'product'
      })
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail product description.', err})
  }
}
  
export async function getAllProductDescriptions(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await ProductDescription.find(queryObj)
      .populate({
        path: 'product'
      })

  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all product descriptions.', err})
  }
}
  
export async function updateProductDescription(opts = {}, payload) {
  const queryObj = {...opts}
  
  try {
    return await ProductDescription.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update product description.', err})
  }
}
  
export async function deleteProductDescription(opts = {}) {
  const queryObj = {...opts}
  
  try {
    return await ProductDescription.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete product description.', err})
  }
}
