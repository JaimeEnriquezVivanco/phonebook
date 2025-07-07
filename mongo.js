const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const password = process.argv[2]

if (!password) {
    console.log("Provide password")
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@cluster0.sjiw3vb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log("Printing all saved people...")

    Person
        .find({})
        .then(people => {
            people.forEach(person => console.log(`${person.name} ${person.number}`))
        })
        .then(_ => mongoose.connection.close())
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    console.log(`Saving ${name} in database...`)

    const person = new Person({ name, number })
    person
        .save()
        .then(res => {
            console.log("Person saved!")
            mongoose.connection.close()
        })
}
