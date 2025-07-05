const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    let now = new Date().toString()
    let res = `
    Phonebook has info for ${persons.length} people
    <br/>
    ${now}
    `
    response.send(res)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === request.params.id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        let errObj = { error: "missing data in request body" }
        res.status(400).json(errObj).end()
        return
    }

    const person = {
        id: crypto.randomUUID(),
        name: body.name,
        number: body.number
    }

    const isAlreadySaved = persons.some(p => p.name === person.name)
    if (isAlreadySaved) {
        let errObj = { error: "person already exists" }
        res.status(400).json(errObj).end()
        return
    }

    persons.push(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})