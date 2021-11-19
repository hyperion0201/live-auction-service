import BiddingProduct from '../models/bidding-product'
import ServerError from '../utils/custom-error'

export async function createBiddingProduct(payload = {}, opts = {}) {
  try {
    return await BiddingProduct.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create bidding product.', err})
  }
}

export async function getBiddingProduct(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingProduct.findOne(queryObj)
      .populate({
        path: 'product',
        populate: {
          path: 'createBy'
        }
      })
      .populate('winner')
      .populate('bannedUsers')
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail bidding product.', err})
  }
}

export async function getAllBiddingProduct(opts = {}) {
  const queryObj = {
    status: {$ne: 'SOLD'},
    publicTime: {$lte: Date.now()},
    ...opts
  }

  try {
    return await BiddingProduct.find(queryObj)
      .populate({
        path: 'product',
        populate: {
          path: 'createBy'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'category'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'subCategory'
        }
      })
      .populate('winner')
      .populate('bannedUsers')
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding product.', err})
  }
}

export async function getAllBiddingProductHasSold(opts = {}) {
  try {
    return await BiddingProduct.find({status: 'SOLD'})
      .populate({
        path: 'product',
        populate: {
          path: 'createBy'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'category'
        }
      })
      .populate({
        path: 'product',
        populate: {
          path: 'subCategory'
        }
      })
      .populate('winner')
      .populate('bannedUsers')
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding product has sold.', err})
  }
}

export async function updateBiddingProduct(opts = {}, payload) {
  const queryObj = {...opts}

  try {
    return await BiddingProduct.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update bidding product.', err})
  }
}

export async function deleteBiddingProduct(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingProduct.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete bidding product.', err})
  }
}
