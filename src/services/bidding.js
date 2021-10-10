import get from 'lodash/get'
import {updateBiddingProduct, getAllBiddingProduct} from './bidding-product'
import {createBiddingRecord} from './bidding-record'

export async function registerNewBidding(payload = {}) {
  const biddingProductId = get(payload, 'biddingProductId')
  const userId = get(payload, 'userId')
  await updateBiddingProduct({
    _id: biddingProductId
  }, {
    currentPrice: get(payload, 'price')
  })

  await createBiddingRecord({
    user: userId,
    biddingProduct: biddingProductId
  })

  // to-do: send email to: seller, highest bid owner, this bidder.

  return getAllBiddingProduct()
}

export async function markBiddingAsCompleted(payload = {}) {

}