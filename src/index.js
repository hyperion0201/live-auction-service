import cors from 'cors'
import debug from 'debug'
import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import {ROOT_APP_NAMESPACE, SERVER_PORT} from './configs'
import * as routers from './controllers'
import {authenticate} from './middlewares/auth'
import {errorHandler} from './middlewares/error'
import {registerNewBidding} from './services/bidding'
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
