const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//load env variables
dotenv.config({ path: './config/config.env' })

//load models
const Bootcamp = require('./models/bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')

//connect to mongo DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
console.log('connected')

//read JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
console.log('bootcamps loaded', bootcamps)

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
console.log('courses loaded', courses)

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
console.log('users loaded', users)

//import data into db
const importData = async()=>{
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        console.log('Data imported ...'.green.inverse)
        process.exit()    
    } catch (err) {
        console.log(err)
    }
}

//delete data from db
const deleteData = async()=>{
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log('Data destroyed ...'.red.inverse)
        process.exit()    
    } catch (err) {
        console.log(err)
    }
}

if(process.argv[2] === '-i'){
    importData()
} else if (process.argv[2] === '-d'){
    deleteData()
}
