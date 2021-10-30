const app = require('./app')
const mongoose = require('mongoose')

const port = 3001


// Recursively continuously try until the damn thing decides to work
const connectToDB = () => {
  console.log('Connecting to Database')

  mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
      // Not much choice in logging to a database we can't connect to
      console.log('Database Connection Failure - Trying Again')

      connectToDB()
      return
    }

    console.log('Connection Established')

    app.listen(port, () => {
      console.log(`Listening on Port ${port}`)
    })
  })
}

connectToDB()