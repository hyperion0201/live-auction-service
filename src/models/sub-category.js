import mongoose from 'mongoose'

const schema = mongoose.Schema(
  {
    name: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory'
    }
  },
  {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}}
)

// Support full text search by sub-category name
schema.index({name: 'text'})

export default mongoose.model('SubCategory', schema)
