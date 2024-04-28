const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.qtdpq32.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number

})

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close();
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log('Added ' + name + ' number ' + number + ' to phonebook');
    mongoose.connection.close();
  })
} else {
  console.log("Incorrect arguments, try again with password, name and number")
  mongoose.connection.close()
}