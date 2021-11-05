import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  imageUrl: String,
  extraImages: Array,
  description: String,
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }
})

export default mongoose.model('Product', schema)
