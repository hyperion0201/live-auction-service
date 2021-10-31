import BiddingRecord from '../models/bidding-record'
import ServerError from '../utils/custom-error'

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
      .populate('biddingProduct')
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
      .populate('biddingProduct')
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
