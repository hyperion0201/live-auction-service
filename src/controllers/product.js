import express from 'express'
import fs from 'fs'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import {BASE_API_URL} from '../configs'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import Category from '../models/category'
import Product from '../models/product.js'
import SubCategory from '../models/sub-category'
import * as serviceProduct from '../services/product.js'
import {HTTP_STATUS_CODES} from '../utils/constants'

const storageConfiguration = multer.diskStorage({
  destination: function (req, file, cb) {
    
    const productId = get(req, 'body.productId')
    const destinationPath = path.join(__dirname, `../../public/uploads/${productId}`)

    const isDestinationPathExists = fs.existsSync(destinationPath)
    if (!isDestinationPathExists) {
      fs.mkdirSync(destinationPath)
    }
    cb(null, destinationPath)
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4()
    cb(null, fileName + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storageConfiguration
})

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

/*
  This router for global searching product.
  This mean this is the common route for fetching/filtering products based on text value.
  That could be anything, product name, category, sub category
 */
router.get('/search', async (req, res, next) => {
  const fullText = get(req, 'query.name', '')
  try {
    // Hack: i used the raw model here for faster query typing.

    // NOTE: with these referencing schemas,
    // full-text-search technique can't be applied for only one schema and refer to others.
    // I need to perform 3 query in Product, Category, Sub-category to get full products
    // that matched with the search value.

    // Phase 1: find in Product
    const products = await Product.find({
      $text: {$search: fullText}
    }).populate({
      path: 'subCategory',
      populate: {
        path: 'category'
      }
    })

    // Phase 2: find in Category
    const categoriesFound = await Category.find({$text: {$search: fullText}})
    const categoryIds = categoriesFound.map((category) => category._id)
    const productsByCategories = await Product.find({
      category: {$in: categoryIds}
    }).populate({
      path: 'subCategory',
      populate: {
        path: 'category'
      }
    })

    // Phase 3: find in SubCategory
    const subCategoriesFound = await SubCategory.find({$text: {$search: fullText}})
    const subCategoryIds = subCategoriesFound.map((subCategory) => subCategory._id)
    const productsBySubCategories = await Product.find({
      subCategory: {$in: subCategoryIds}
    }).populate({
      path: 'subCategory',
      populate: {
        path: 'category'
      }
    })

    res.json({
      data: uniqBy([...products, ...productsByCategories, ...productsBySubCategories], (item) => item._id.toString())
    })
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

router.post(
  '/upload-image',
  authenticate(),
  upload.single('image'),
  async (req, res, next) => {
    const productId = get(req, 'body.productId')
    // we just store the full path to database,
    // for retrieving products, we populate themselves with current api base url.
    const fullPath = `${BASE_API_URL}/public/uploads/${productId}/${req.file.filename}`

    try {

      await serviceProduct.updateProduct({_id: mongoose.Types.ObjectId(productId)}, {
        imageUrl: fullPath
      })

      res.json({
        message: 'uploaded.'
      })
    }

    catch (err) {
      next(err)
    }
  }
)

router.post(
  '/upload-extra-images',
  authenticate(),
  upload.array('images', 5),
  async (req, res, next) => {
    const productId = get(req, 'body.productId')

    const paths = req.files.map((file) => {
      return `${BASE_API_URL}/public/uploads/${productId}/${file.filename}`
    })

    try {
      await serviceProduct.updateProduct({_id: mongoose.Types.ObjectId(productId)}, {
        $push: {extraImages: {$each: paths}}
      })
      res.json({
        message: 'uploaded.'
      })
    }
    catch (err) {
      next(err)
    }
  }
)

export default {
  prefix: `${VERSION_API}/product`,
  routerInstance: router
}
