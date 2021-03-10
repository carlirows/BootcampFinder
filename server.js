const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

//route files
const bootcamps = require('./routes/bootcamps')

//load dotenv variables
dotenv.config({ path: './config/config.env' })

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