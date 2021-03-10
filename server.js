const express = require('express')
const dotenv = require('dotenv')

//load dotenv variables
dotenv.config({path: './config/config.env' })


const app = express()

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('server up and running on port ', PORT)
})