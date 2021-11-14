import cors from 'cors'
import debug from 'debug'
import express from 'express'
import http from 'http'
import get from 'lodash/get'
import path from 'path'
import {Server} from 'socket.io'
import {ROOT_APP_NAMESPACE, SERVER_PORT} from './configs'
import * as routers from './controllers'
import {authenticate} from './middlewares/auth'
import {errorHandler} from './middlewares/error'
import {markBiddingAsCompleted, registerNewBidding} from './services/bidding'
import * as biddingProductService from './services/bidding-product'
import sendEmail from './services/email'
import {registerClient, deregisterClient} from './services/socket'
import * as taskScheduler from './services/task-scheduler'
import * as userService from './services/user'
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
      const biddingFromDetail = get(payload, 'biddingFromDetail', false)
      const {biddingProductId} = payload

      debug.log('payload bidding: ', payload)
      
      const biddingProduct = await biddingProductService.getBiddingProduct({
        _id: biddingProductId
      })

      const bannedUsers = get(biddingProduct, 'bannedUsers', [])
      let isBanned = false
      bannedUsers.forEach((user) => {
        if (get(user, '_id') === userId) {
          isBanned = true
        }
      })
      
      if (isBanned) {
        socket.emit('reject-bidding', {
          payload: {
            isBanned: true,
            message: 'Can not place a bid on this product because this user was banned.'
          }
        })
        return
      }
      
      
      const result = await registerNewBidding(payload, biddingProduct)
      
      // todo: update db, then broadcast to all active clients
      socket.broadcast.emit('new-bidding', {
        payload: {
          ...result
        },
        biddingFromDetail
      })

      // find all user have at least 1 bid to current product

      const currentWinner = get(biddingProduct, 'winner.email')
      const productName = get(biddingProduct, 'biddingProduct.product.name')

      const seller = get(biddingProduct, 'product.createBy.email')

      // find new biddng user
      const newUser = await userService.getUser({
        _id: get(payload, 'userId')
      })

      sendEmail(newUser.email,
        '[Live Auction] - Bidding successfully on product',
        `Hi.
           Congratulation on your bidding. You are the current winner, but you should still wait for the bidding time to end.
           
           Info:
               Product name: ${productName}
               New bidding price: ${payload.price}
        `)

      sendEmail(currentWinner,
        '[Live Auction] - New bidding higher than your bid',
        `Hi.
           You received this email because a new bidding was placed on the product you've bidded on.
           
           Info:
               Product name: ${productName}
               New bidding price: ${payload.price}
        `)

      sendEmail(seller,
        '[Live Auction] - New bidding on your product',
        `Hi.
           You received this email because a new bidding was placed on your product .
           
           Info:
               Product name: ${productName}
               New bidding price: ${payload.price}
        `)

    })

    // when server receive a buy-now event
    socket.on('buy-now', async payload => {
      debug.log('payload buy-now: ', payload)
      const biddingFromDetail = get(payload, 'biddingFromDetail', false)
      const {biddingProductId} = payload
      
      const biddingProduct = await biddingProductService.getBiddingProduct({
        _id: biddingProductId
      })

      const bannedUsers = get(biddingProduct, 'bannedUsers', [])
      let isBanned = false
      bannedUsers.forEach((user) => {
        if (get(user, '_id') === userId) {
          isBanned = true
        }
      })
      
      if (isBanned) {
        socket.emit('reject-bidding', {
          payload: {
            isBanned: true,
            message: 'Can not place a bid on this product because this user was banned.'
          }
        })
        return
      }
      
      const result = await markBiddingAsCompleted(payload, biddingProduct)
      
      // todo: update db, then broadcast to all active clients
      socket.broadcast.emit('new-buy-now', {
        payload: {
          ...result
        },
        biddingFromDetail
      })

      // find all user have at least 1 bid to current product

      const currentWinner = get(biddingProduct, 'winner.email')
      const productName = get(biddingProduct, 'biddingProduct.product.name')

      const seller = get(biddingProduct, 'product.createBy.email')

      // find new biddng user
      const newUser = await userService.getUser({
        _id: get(payload, 'userId')
      })

      sendEmail(newUser.email,
        '[Live Auction] - You are the winner',
        `Hi.
           Congratulation on your bidding. You are the winner since you've chosen to buy instead of bidding.
           
           Info:
               Product name: ${productName}
               Your buy now price: ${payload.price}
        `)

      sendEmail(currentWinner,
        '[Live Auction] - Your bidding was totally closed since someone has bought this product',
        `Hi.
           You received this email because someone has bought the product you've bidded on.
           
           Info:
               Product name: ${productName}
        `)

      sendEmail(seller,
        '[Live Auction] - Your product was sold',
        `Hi.
           You received this email because someone has bought your product .
           
           Info:
               Product name: ${productName}
               Winner: ${newUser.email}
        `)
        
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

    taskScheduler.startBackgroundService()
  }
  catch (err) {
    debug.log(ROOT_APP_NAMESPACE, 'Something error when start app! ', err)
    process.exit(1)
  }
}

main()
