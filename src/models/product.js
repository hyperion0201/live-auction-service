import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  imageUrl: String,
  primaryImage: String,
  extraImages: Array,
  description: String,
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  }]
})

export default mongoose.model('Product', schema)
