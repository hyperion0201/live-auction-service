import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
})

export default mongoose.model('SubCategory', schema)
