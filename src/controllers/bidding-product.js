/* eslint-disable babel/new-cap */
import express from 'express'
import {authenticate} from '../middlewares/auth'
import * as serviceBiddingProduct from '../services/bidding-product'
import {HTTP_STATUS_CODES} from '../utils/constants'

const router = express.Router()

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
    const biddingProduct = await serviceBiddingProduct.getBiddingProduct({where: {id}})
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
    await serviceBiddingProduct.updateBiddingProduct({where: {id}}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  try {
    await serviceBiddingProduct.deleteBiddingProduct({where: {id}})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})
