import { Schema, model } from 'mongoose'

const GainLossSchema = new Schema({
  hashId: {
    type: String,
    required: true,
  },
  close_date: {
    type: Date,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  gain_loss: {
    type: Number,
    required: true,
  },
  gain_loss_percent: {
    type: Number,
    required: true,
  },
  open_date: {
    type: Date,
    required: true,
  },
  proceeds: {
    type: Number,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
})

const gainLossModel = model('closedTrade', GainLossSchema)

export {
  gainLossModel
}