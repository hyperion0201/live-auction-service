import debug from 'debug'
import get from 'lodash/get.js'
import schedule from 'node-schedule'
import {SCHEDULE_TASK_INTERVAL_IN_MINUTE} from '../../configs.js'
import * as biddingProductService from '../bidding-product.js'
import sendEmail from '../email.js'

// Defining background task which handle the end bidding event

const ns = 'bidding-bg-job'

const jobHandler = async (bProduct) => {
  const seller = get(bProduct, 'product.createBy', null)
  const winner = get(bProduct, 'winner', null)
  const productName = get(bProduct, 'product.name')
  const finalPrice = get(bProduct, 'currentPrice')
  const bProductId = get(bProduct, '_id')

  // Mark bidding product was ended.
  try {
    // send email to winner if was found
    if (winner) {

      await biddingProductService.updateBiddingProduct({
        _id: bProductId
      }, {
        status: 'SOLD'
      })

      await sendEmail(winner.email,
        '[Live Auction] - You are the winner',
        `Hi.
               Congratulation on your bidding. You are the highest paid for this product.
               
               Info:
                   Product name: ${productName}
                   Your bidding price: ${finalPrice}
        `)

      await sendEmail(seller.email,
        '[Live Auction] - Bidding end on your product',
        `Hi.
               Your product was sold.
               Below is the winner information:
               
               Info:
                   Product name: ${productName}
                   Winner email: ${winner.email}
                   Bidding price: ${finalPrice}
    
            `)
    }
    else {
      // No winner found
      await biddingProductService.updateBiddingProduct({
        _id: bProductId
      }, {
        status: 'EXPIRED'
      })

      await sendEmail(seller.email,
        '[Live Auction] - Bidding end on your product',
        `Hi.

        Your product was't sold since we didn't found any bidding on it.
        `)
    }
  }
  catch (err) {
    debug.log(ns, 'Error found when handling end-bidding event: ', err)
  }

}
export const startBackgroundService = () => {
  return schedule.scheduleJob(`*/${SCHEDULE_TASK_INTERVAL_IN_MINUTE} * * * *`, async () => {
    debug.log(ns, 'In-schedule: Executing the end-bidding handler...')

    const biddingProducts = await biddingProductService.getAllBiddingProduct({
      status: 'AVAILABLE',
      endTime: {
        $lte: new Date()
      }
    })

    debug.log(ns, `Found ${biddingProducts.length} bidding products that ended...`)

    const jobs = biddingProducts.map((bProduct) => {
      return jobHandler(bProduct)
    })

    await Promise.all(jobs)
  })
}
