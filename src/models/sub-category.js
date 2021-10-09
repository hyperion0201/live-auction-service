import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String
})

export default mongoose.model("SubCategory", schema)