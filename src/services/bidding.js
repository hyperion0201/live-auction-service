import get from 'lodash/get'
import moment from 'moment'
import {updateBiddingProduct, getAllBiddingProduct} from './bidding-product'
import {createBiddingRecord} from './bidding-record'

export async function registerNewBidding(payload = {}, biddingProduct = {}) {
  const biddingProductId = get(payload, 'biddingProductId')
  const userId = get(payload, 'userId')

  // if user place a bid in last 5 minutes of the endTime, extend the endTime for 10 mins.
  const endBiddingTime = moment(get(biddingProduct, 'endTime'))
  const timeDiff = moment().diff(endBiddingTime, 'minutes')

  const valueChanged = {
    currentPrice: get(payload, 'price'),
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
    biddingProduct: biddingProductId
  })

  return getAllBiddingProduct()
}

export async function markBiddingAsCompleted(payload = {}) {
    
}
