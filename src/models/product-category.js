import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  subCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }]
})

export default mongoose.model('ProductCategory', schema)
