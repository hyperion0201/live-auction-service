import get from 'lodash/get'
import {updateBiddingProduct, getAllBiddingProduct} from './bidding-product'
import {createBiddingRecord} from './bidding-record'

export async function registerNewBidding(payload = {}) {
  await updateBiddingProduct({
    _id: get(payload, 'biddingProductId')
  }, {
    currentPrice: get(payload, 'price')
  })

  await createBiddingRecord({
    user: get(payload, 'userId')
  })

  return getAllBiddingProduct()
}
