const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

//load dotenv variables
//this must be loaded before any routes
dotenv.config({ path: './config/config.env' })

//route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

//connect to database
connectDB()

// creating express instance
const app = express()

//bodyparser
app.use(express.json())

//dev loggin middleware
app.use(morgan('dev'))

//mount router
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

//error handler, comes AFTER the routes, 
app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen(PORT, ()=>{
    console.log(`server up and running on port ${PORT}`.yellow.bold)
})

//handle unhandled promise rejetion
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`.red)
    //Close server & exit proccess
    server.close(()=> process.exit(1))
})