import { Schema, model } from 'mongoose'

const PositionHistorySchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  acquired: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  costBasis: {
    type: Number,
    required: true,
  }
})

const positionHistoryModel = model('positionHistory', PositionHistorySchema)

export {
  positionHistoryModel
}