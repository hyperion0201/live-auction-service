import {debug} from 'debug'
import {HTTP_STATUS_CODES} from '../utils/constants'

const FALLBACK_ERROR_NS = 'error-fallback'

export function errorHandler(err, req, res, next) {
  if (err.logDetail) {
    err.logDetail({omitStackTrace: false})
  }
  else {
    debug.log(FALLBACK_ERROR_NS, 'Found unexpected error : ', err)
  }
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
    message: err.name
  })
}
