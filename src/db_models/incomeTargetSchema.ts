import { Schema, model } from 'mongoose'

const IncomeTargetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  scope: {
    type: String,
    enum: [ 'month', 'year', 'allTime' ],
    required: true,
  },
  stackable: {
    type: Boolean,
    required: true,
  },
})

const incomeTargetModel = model('incomeTarget', IncomeTargetSchema)

export {
  incomeTargetModel
}