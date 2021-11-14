import express from 'express'
import {VERSION_API} from '../constants.js'
import {authenticate} from '../middlewares/auth.js'

import * as serviceProductDescription from '../services/product-description.js'
import {HTTP_STATUS_CODES} from '../utils/constants.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const payload = req.body
  try {
    const product = await serviceProductDescription.createProductDescription(payload)
    res.json(product)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', authenticate(), async (req, res, next) => {
  const query = req.query || {}
  try {
    const product = await serviceProductDescription.getAllProductDescriptions(query)
    res.json(product)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    const product = await serviceProductDescription.getProductDescription({_id: id})
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
  const id = req.params.id
  const payload = req.body
  try {
    await serviceProductDescription.updateProductDescription({_id: id}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    await serviceProductDescription.deleteProductDescription({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/product-description`,
  routerInstance: router
}
