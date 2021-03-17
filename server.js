const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')

//load dotenv variables
//this must be loaded before any routes
dotenv.config({ path: './config/config.env' })

//route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

//connect to database
connectDB()

// creating express instance
const app = express()

//bodyparser
app.use(express.json())

//cookie parser
app.use(cookieParser())

//dev loggin middleware
app.use(morgan('dev'))

//file uploading
app.use(fileupload())

//set static folder
app.use(express.static(path.join(__dirname,'public')))

//mount router
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)

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