import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  }
})

export default mongoose.model('SubCategory', schema)
