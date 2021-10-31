import express from 'express'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import * as serviceBiddingProduct from '../services/bidding-product'
import {HTTP_STATUS_CODES} from '../utils/constants'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const payload = req.body
  try {
    const biddingProduct = await serviceBiddingProduct.createBiddingProduct(payload)
    res.json(biddingProduct)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', authenticate(), async (req, res, next) => {
  try {
    const biddingProducts = await serviceBiddingProduct.getAllBiddingProduct()
    res.json(biddingProducts)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  try {
    const biddingProduct = await serviceBiddingProduct.getBiddingProduct({_id: id})
    if (!biddingProduct) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(biddingProduct)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  const payload = req.body
  try {
    await serviceBiddingProduct.updateBiddingProduct({_id: id}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  try {
    await serviceBiddingProduct.deleteBiddingProduct({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/bidding-product`,
  routerInstance: router
}
