const mongoose = require('mongoose')

const IncomeTargetSchema = mongoose.Schema({
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

module.exports = mongoose.model('incomeTarget', IncomeTargetSchema)