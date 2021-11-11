import mongoose from 'mongoose'

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    biddingProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BiddingProduct'
    },
    biddingPrice: Number
  },
  {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}}
)

export default mongoose.model('BiddingRecord', schema)
