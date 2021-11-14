import get from 'lodash/get.js'
import moment from 'moment'
import {updateBiddingProduct, getAllBiddingProduct} from './bidding-product.js'
import {createBiddingRecord} from './bidding-record.js'

export async function registerNewBidding(payload = {}, biddingProduct = {}) {
  const biddingProductId = get(payload, 'biddingProductId')
  const userId = get(payload, 'userId')
  const price = get(payload, 'price', 0)
  // if user place a bid in last 5 minutes of the endTime, extend the endTime for 10 mins.
  const endBiddingTime = moment(get(biddingProduct, 'endTime'))
  const timeDiff = moment().diff(endBiddingTime, 'minutes')
  
  const valueChanged = {
    currentPrice: price,
    winner: userId
  }

  if (timeDiff > 0 && timeDiff < 5) {
    valueChanged.endTime = endBiddingTime.add(10, 'minutes').toISOString()
  }

  await updateBiddingProduct({
    _id: biddingProductId
  }, {
    ...valueChanged
  })

  await createBiddingRecord({
    user: userId,
    biddingProduct: biddingProductId,
    biddingPrice: price
  })

  return getAllBiddingProduct()
}

export async function markBiddingAsCompleted(payload = {}, biddingProduct = {}) {
  const biddingProductId = get(payload, 'biddingProductId')
  const userId = get(payload, 'userId')
  const price = get(payload, 'price', 0)

  // mark current user as the winner
  await updateBiddingProduct({
    _id: biddingProductId
  }, {
    status: 'SOLD',
    winner: userId,
    currentPrice: price
  })

  await createBiddingRecord({
    userId,
    biddingProduct: biddingProductId,
    biddingPrice: price
  })
  
  return getAllBiddingProduct()
}
