require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')


const Character = require('./models/character')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))



let test = [
  {
    content: "jep jep joo asd",
    name: "testijänä"
  },
  {
    content: "lorem :D ipsum :D saatana :D",
    name: "aaaaaaa"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>huutista</h1>')
})

app.get('/api/test', (req, res) => {
  Character.find({}).then(characters => {
    res.json(characters.map(character => character.toJSON()))
  })
})

app.get('/api/test/:id', (req, res) => {
  Character.findById(req.params.id).then(character => {
    console.log(character)
    res.json(character.toJSON())
  })
})

app.post('/api/test', (req, res) => {
  const body = req.body
  const char = new Character({
    name: body.name,
    skills: body.skills,
    stats: body.stats
  })

  char.save().then(savedPerson => {
    console.log('mongodb returned')
    res.json(savedPerson.toJSON())
  })
    .catch(error => res.status(400).json({ 'error': error.message }))
})

app.put('/api/test/:id', (req, res, next) => {
  const body = req.body
  const charToSave = body
  console.log(charToSave)
  Character.findByIdAndUpdate(req.params.id, charToSave, { new: true })
    .then(updatedCharacter => {
      console.log(updatedCharacter)
      res.json(updatedCharacter.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'CastError' && error.kind == 'ObjectId') {
    return Response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})