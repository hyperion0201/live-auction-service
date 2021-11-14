import BiddingRecord from '../models/bidding-record'
import ServerError from '../utils/custom-error'
import {getBiddingProduct} from './bidding-product'
import get from 'lodash/get'

export async function createBiddingRecord(payload = {}, opts = {}) {
  try {
    return await BiddingRecord.create({...payload})
  }
  catch (err) {
    throw new ServerError({name: 'Something error when create bidding record.', err})
  }
}

export async function getBiddingRecord(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingRecord.findOne(queryObj)
      .populate('user')
      .populate({
        path: 'biddingProduct',
        populate: {
          path: 'product'
        }
      })
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get detail bidding record.', err})
  }
}

export async function getAllBiddingRecord(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingRecord.find(queryObj)
      .populate('user')
      .populate({
        path: 'biddingProduct',
        populate: {
          path: 'product'
        }
      })
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding record.', err})
  }
}

export async function getAllStandardBiddingRecord(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingRecord.find(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding record.', err})
  }
}

export async function updateBiddingRecord(opts = {}, payload) {
  const queryObj = {...opts}

  try {
    return await BiddingRecord.updateOne(queryObj, payload)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when update bidding record.', err})
  }
}

export async function deleteBiddingRecord(opts = {}) {
  const queryObj = {...opts}

  try {
    return await BiddingRecord.deleteOne(queryObj)
  }
  catch (err) {
    throw new ServerError({name: 'Something error when delete bidding record.', err})
  }
}

export async function getBiddingRecordsByProductId(productId) {
  try {
    const biddingProduct = await getBiddingProduct({
      product: productId
    })

    const bProductId = get(biddingProduct, '_id')

    if (bProductId) {
      return await getAllBiddingRecord({
        biddingProduct: bProductId
      })
    }
  }
  catch (err) {
    throw new ServerError({name: 'Something error when get all bidding records.', err})
  }
}