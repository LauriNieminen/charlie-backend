const mongoose = require('mongoose')

console.log(process.env.MONGODB_URI)
const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.log('error connecting to mongodb:', error.message)
  })

  const characterSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    skills: {
      type: Array
    },
    stats: {
      type: Array
    }
  })

  characterSchema.set('toJSON', {
    tranform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Character', characterSchema)