import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String
})

// Support full text search by category name
schema.index({name: 'text'})

export default mongoose.model('ProductCategory', schema)
