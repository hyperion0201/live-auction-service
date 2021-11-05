import cors from 'cors'
import debug from 'debug'
import express from 'express'
import http from 'http'
import get from 'lodash/get'
import mongoose from 'mongoose'
import path from 'path'
import {Server} from 'socket.io'
import {ROOT_APP_NAMESPACE, SERVER_PORT} from './configs'
import * as routers from './controllers'
import {authenticate} from './middlewares/auth'
import {errorHandler} from './middlewares/error'
import {registerNewBidding} from './services/bidding'
import {getAllBiddingRecord} from './services/bidding-record'
import sendEmail from './services/email'
import {registerClient, deregisterClient} from './services/socket'
import {setupLogStash, initDatabaseConnection, combineRouters} from './utils/setup'

import 'express-async-errors'

async function initialize(cb) {
  const app = express()
  const server = http.Server(app)
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })
  const ns = 'socket-server'

  // socket event emiiters and handlers
  // due to rush time, i can't have enough time to refactor it
  // so i have to handle all events here (anti-pattern)

  io.on('connection', (socket) => {
    debug.log(ns, 'Client connected: ', socket.id)
    registerClient(socket)

    // when server receive a bidding event
    socket.on('bidding', async payload => {
      debug.log('payload bidding: ', payload)
      
      const result = await registerNewBidding(payload)
      
      debug.log(`${ns}:bidding`, result)
      // todo: update db, then broadcast to all active clients
      socket.broadcast.emit('new-bidding', {
        payload: result
      })

      // find all user have at least 1 bid to current product
      const {biddingProductId} = payload
      const records = await getAllBiddingRecord({
        biddingProduct: mongoose.Types.ObjectId(biddingProductId)
      })
      return records.forEach((record) => {
        const userEmail = get(record, 'user.email')
        const productName = get(record, 'biddingProduct.product.name')

        sendEmail(userEmail,
          '[Live Auction] - New bidding on your product',
          `Hi.
           You received this email because a new bidding was placed on the product you've bidded on.
           
           Info:
               Product name: ${productName}
               New bidding price: ${payload.price}
        `)
      })
    })

    // when server receive a buy-now event
    socket.on('buy-now', payload => {
      debug.log('payload buy-now: ', payload)
      // const {
      //   productID="",
      //   userID="",
      // }=payload
      // todo: update db, then broadcast to all active clients

      socket.broadcast.emit('sold-out-product', {
        productID: 200
      })
    })
  })

  app.use(cors())

  // serve static files in public folder
  // since i don't have enough money to store files in other storage services.
  debug.log(ns, 'Upload dir : ', path.join(__dirname, '../public/uploads'))
  app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')))
  // register middlewares
  app.use(express.json())
  combineRouters(app, routers)

  app.get(
    '/',
    authenticate({
      requiredAdmin: true
    }),
    async (req, res, next) => {
      res.json(req.user)
    }
  )

  // error middleware should be register at the end of express instance.
  app.use(errorHandler)
  server.listen(SERVER_PORT, cb)
}

async function main() {
  setupLogStash({
    debugNamespace: ROOT_APP_NAMESPACE
  })

  try {
    await initDatabaseConnection()
    await initialize(() => {
      debug.log(ROOT_APP_NAMESPACE, 'Server run at ' + SERVER_PORT)
    })
  }
  catch (err) {
    debug.log(ROOT_APP_NAMESPACE, 'Something error when start app! ', err)
    process.exit(1)
  }
}

main()
