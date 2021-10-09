import cors from 'cors'
import debug from 'debug'
import express from 'express'
import {ROOT_APP_NAMESPACE, SERVER_PORT} from './configs'
import * as routers from './controllers'
import {authenticate} from './middlewares/auth'
import {errorHandler} from './middlewares/error'
import {setupLogStash, initDatabaseConnection, combineRouters} from './utils/setup'

import 'express-async-errors'

async function initialize(cb) {
  const app = express()

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
  app.listen(SERVER_PORT, cb)
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
