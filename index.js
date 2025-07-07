require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
    Person
        .countDocuments({})
        .then(count => {
            let now = new Date().toString()
            let res = `
            Phonebook has info for ${count} people
            <br/>
            ${now}
            `
            response.send(res)
        })

})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(people => response.json(people))
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => response.json(person))
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(result => response.status(204).end())
        .catch(err => next(err))
})

app.post('/api/persons/', (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number) {
        let errObj = { error: "missing data in request body" }
        res.status(400).json(errObj).end()
        return
    }

    // ex 3.14 says can be ignored
    // const isAlreadySaved = persons.some(p => p.name === person.name)
    // if (isAlreadySaved) {
    //     let errObj = { error: "person already exists" }
    //     res.status(400).json(errObj).end()
    //     return
    // }

    Person
        .create({ name, number })
        .then(person => res.json(person))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})