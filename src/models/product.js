import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  imageUrl: String,
  extraImages: Array,
  description: String,
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }
})

// Support full text search with product name
schema.index({name: 'text'})

export default mongoose.model('Product', schema)
