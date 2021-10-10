import SubCategory from '../models/sub-category.js'
import ServerError from '..utils/custom-error.js'

export async function createSubCategory(payload = {}, opts = {}) {
    try {
        return await SubCategory.create({ ...payload })
    }
    catch (err) {
        throw new ServerError({ name: 'Something error when create bidding product.', err })
    }
}

export async function getSubCategory(opts = {}) {
    const queryObj = {...opts}
  
    try {
      return await SubCategory.findOne(queryObj)
    }
    catch (err) {
      throw new ServerError({name: 'Something error when get detail bidding product.', err})
    }
  }
  
  export async function getAllSubCategory(opts = {}) {
    const queryObj = {...opts}
  
    try {
      return await SubCategory.find(queryObj)
    }
    catch (err) {
      throw new ServerError({name: 'Something error when get all bidding product.', err})
    }
  }
  
  export async function updateSubCategory(opts = {}, payload) {
    const queryObj = {...opts}
  
    try {
      return await Product.updateOne(queryObj, payload)
    }
    catch (err) {
      throw new ServerError({name: 'Something error when update bidding product.', err})
    }
  }
  
  export async function deleteSubCategory(opts = {}) {
    const queryObj = {...opts}
  
    try {
      return await SubCategory.deleteOne(queryObj)
    }
    catch (err) {
      throw new ServerError({name: 'Something error when delete bidding product.', err})
    }
  }