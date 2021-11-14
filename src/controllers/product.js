import express from 'express'
import fs from 'fs'
import get from 'lodash/get.js'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import {BASE_API_URL} from '../configs.js'
import {VERSION_API} from '../constants.js'
import {authenticate} from '../middlewares/auth.js'
import * as serviceProduct from '../services/product.js'
import {HTTP_STATUS_CODES} from '../utils/constants.js'

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

router.post('/', authenticate(), async (req, res, next) => {
  const payload = req.body

  try {
    const product = await serviceProduct.createProduct({...payload, createBy: get(req, 'user._id')})
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
  const id = req.params.id
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
  const id = req.params.id
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
  const id = req.params.id
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
