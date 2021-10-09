import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  imageUrl: Date,
  primaryImage: String,
  extraImages: Array,
  buyNowPrice: Number,
  description: String,
    status: {
        type: String,
        enum: ['SOLD', 'HOLDING', 'AVAILABLE'],
        default: 'AVAILABLE'
    },
    stepPrice: Number,
    initPrice: Number,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }]
})

export default mongoose.model("Product", schema)