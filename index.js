const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id:4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send(index.html)
})
  
app.get('/info', (request, response) => {
  const time = new Date()
  response.send('Phonebook has info for ' + persons.length + ' people <br>' +time)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
  
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
let randomId = Math.floor(Math.random() * 10000)

return randomId
}
  
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('Data of POST body', body)

  if (persons.some(person => person.name === body.name)) {
    throw new Error('Duplicate contact')
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }  else if (error.message === 'Duplicate contact') {
      return response.status(400).json({ error: error.message })
    } else {
    response.status(500).json({ error: 'internal server error' })
  }
}

  // tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
  app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
