import express from 'express'
import {VERSION_API} from '../constants.js'
import {authenticate} from '../middlewares/auth.js'
import * as categoryService from '../services/category.js'
import * as productService from '../services/product.js'
import {HTTP_STATUS_CODES} from '../utils/constants.js'

const router = express.Router()

router.get('/', authenticate(), async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories()
    res.json(categories)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id

  try {
    const category = await categoryService.getByID({_id: id})
    if (!category) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({message: 'find not found'})
    }
    res.json(category)
  }
  catch (err) {
    next(err)
  }
})

router.post('/', authenticate({requiredAdmin: true}), async (req, res, next) => {
  const payload = req.body
  try {
    const newCategory = await categoryService.addNew(payload)
    res.json(newCategory)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate({requiredAdmin: true}), async (req, res, next) => {
  const id = req.params.id
  const payload = req.body
  try {
    await categoryService.updateOneCategory({_id: id}, payload)
    res.json({message: 'Update category successfully'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate({requiredAdmin: true}), async (req, res, next) => {
  const id = req.params.id

  try {
    const productsWithCategory = await productService.getAllProduct({
      category: id
    })
    
    if (productsWithCategory.length > 0) {
      return res.status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({message: 'Can not remove category because there are some products belong to it'})
    }

    await categoryService.deleteOneCategory({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/categories`,
  routerInstance: router
}
