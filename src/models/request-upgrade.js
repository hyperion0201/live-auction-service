import mongoose from 'mongoose'

const schema = mongoose.Schema(
  {
    description: String,
    createBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
  {timestamp: {createdAt: 'createdAt', updatedAt: 'updatedAt'}}
)

export default mongoose.model('RequestUpgrade', schema)
