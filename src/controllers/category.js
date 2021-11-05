import express from 'express'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import * as categoryService from '../services/category'
import {HTTP_STATUS_CODES} from '../utils/constants'

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

router.post('/', authenticate(), async (req, res, next) => {
  const payload = req.body
  try {
    const newCategory = await categoryService.addNew(payload)
    res.json(newCategory)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
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

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id

  try {
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
