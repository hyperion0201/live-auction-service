import express from 'express'

import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import {VERSION_API} from '../constants'
import {authenticate} from '../middlewares/auth'
import Category from '../models/category'
import Product from '../models/product.js'
import SubCategory from '../models/sub-category'
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

/*
  This router for global searching bidding product.
  This mean this is the common route for fetching/filtering bidding products based on text value.
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
  
    // Phase 1: find in BiddingProduct
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
    
    const uniqProducts = uniqBy([
      ...products, ...productsByCategories, ...productsBySubCategories
    ], (item) => item._id.toString()).map((p) => p._id)

    const finalResult = await serviceBiddingProduct.getAllBiddingProduct({
      product: {$in: uniqProducts}
    })

    res.json({
      data: finalResult
    })
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
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

router.get('/product/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
  try {
    const biddingProduct = await serviceBiddingProduct.getBiddingProduct({product: id})
    if (!biddingProduct) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: 'not found'})
    }
    res.json(biddingProduct)
  }
  catch (err) {
    next(err)
  }
})

router.post('/:id/ban-user', authenticate(), async (req, res, next) => {
  const {userIds = []} = req.body
  const id = req.params.id
  try {
    await serviceBiddingProduct.updateBiddingProduct({
      _id: id
    }, {
      $push: {bannedUsers: {$each: userIds}}
    })
    
    res.json({
      message: 'Successfully banned user.'
    })
  }
  catch (err) {
    next(err)
  }
})

router.patch('/:id', authenticate(), async (req, res, next) => {
  const id = req.params.id
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
  const id = req.params.id
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
