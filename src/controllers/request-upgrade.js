import express from 'express'
import get from 'lodash/get.js'
import {VERSION_API} from '../constants.js'
import {authenticate} from '../middlewares/auth.js'
import * as serviceRequestUpgrade from '../services/request-upgrade.js'
import {HTTP_STATUS_CODES} from '../utils/constants.js'

const router = express.Router()

router.get('/', authenticate({requiredAdmin: true}), async (req, res, next) => {
  try {
    const requestUpgrade = await serviceRequestUpgrade.getRequestsUpgrade()
    res.json(requestUpgrade)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate({requiredAdmin: true}), async (req, res, next) => {
  const id = req.params.id

  try {
    const requestUpgrade = await serviceRequestUpgrade.getById({_id: id})
    if (!requestUpgrade) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(requestUpgrade)
  }
  catch (err) {
    next(err)
  }
})

router.post('/', authenticate(), async (req, res, next) => {
  const payload = req.body
  payload.createBy = get(req, 'user._id')
  try {
    const newRequestUpgrade = await serviceRequestUpgrade.create(payload)
    res.json(newRequestUpgrade)
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/request-upgrade`,
  routerInstance: router
}
