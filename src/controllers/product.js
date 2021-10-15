import express from 'express'
import {authenticate} from '../middlewares/auth'
import * as serviceProduct from '../services/product.js'
import {HTTP_STATUS_CODES} from '../utils/constants'
import {VERSION_API} from "../constants"

const router = express.Router()

router.post('/', async (req, res, next) => {
  const payload = req.body
  try {
    const product = await serviceProduct.createProduct(payload)
    res.json(product)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', authenticate(), async (req, res, next) => {
  try {
    const product = await serviceProduct.getAllProduct()
    res.json(product)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  try {
    const product = await serviceProduct.getProduct({_id: id})
    if (!product) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(product)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  const payload = req.body
  try {
    await serviceProduct.updateProduct({_id: id}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = +req.params.id
  try {
    await serviceProduct.deleteProduct({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/product`,
  routerInstance: router
}
