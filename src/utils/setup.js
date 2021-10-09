import { DB_NAME, DB_PASSWORD, DB_USER } from '../configs'
import debug from 'debug'
import mongoose from 'mongoose'

export function setupLogStash(options) {
  const {debugNamespace = '*'} = options
  debug.enable(debugNamespace)
}

const DB_CONNECT_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@live-auction-db.ydw6t.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

export async function initDatabaseConnection() {
  const ns = 'atlas:connection'
  debug.log(ns, 'Connecting to database server...')
  return mongoose.connect(DB_CONNECT_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    debug.log(ns, 'Connection granted.')
  }).catch(err => debug.log(ns, 'Connection rejected.', err))
}

export function combineRouters(app, routers) {
  for (const router of Object.values(routers)) {
    const {prefix, routerInstance} = router
    app.use(prefix, routerInstance)
  }
}
