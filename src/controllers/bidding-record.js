import express from 'express'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import * as serviceBiddingRecord from '../services/bidding-record'
import {HTTP_STATUS_CODES} from '../utils/constants'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const payload = req.body
  try {
    const biddingRecord = await serviceBiddingRecord.createBiddingRecord(payload)
    res.json(biddingRecord)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', authenticate(), async (req, res, next) => {
  try {
    const biddingRecords = await serviceBiddingRecord.getAllBiddingRecord()
    res.json(biddingRecords)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    const biddingRecord = await serviceBiddingRecord.getBiddingRecord({_id: id})
    if (!biddingRecord) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(biddingRecord)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  const payload = req.body
  try {
    await serviceBiddingRecord.updateBiddingRecord({_id: id}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    await serviceBiddingRecord.deleteBiddingRecord({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/bidding-record`,
  routerInstance: router
}
