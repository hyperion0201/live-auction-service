import express from 'express'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import * as serviceSubCategory from '../services/sub-category'
import {HTTP_STATUS_CODES} from '../utils/constants'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const payload = req.body
  
  try {
    const subCategory = await serviceSubCategory.createSubCategory(payload)
    res.json(subCategory)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', authenticate(), async (req, res, next) => {
  try {
    const subCategory = await serviceSubCategory.getAllSubCategory()
    res.json(subCategory)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    const subCategory = await serviceSubCategory.getSubCategory({_id: id})
    if (!subCategory) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(subCategory)
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  const payload = req.body
  try {
    await serviceSubCategory.updateSubCategory({_id: id}, payload)
    res.json({message: 'Update success'})
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    await serviceSubCategory.deleteSubCategory({_id: id})
    res.json({message: 'Delete success'})
  }
  catch (err) {
    next(err)
  }
})

export default {
  prefix: `${VERSION_API}/sub-category`,
  routerInstance: router
}
