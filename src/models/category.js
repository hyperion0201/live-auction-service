import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String
})

export default mongoose.model('ProductCategory', schema)
