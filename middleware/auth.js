const jwt= require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

//protect routes
exports.protect = asyncHandler(async(req, res, next)=>{
    let token
    //take token value from the headers of the http request
    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
        ){  console.log('hay auth en los headers')
            token = req.headers.authorization.split(' ')[1]   
            console.log('el propio token', token)       
        }

/*         else if(req.cookies.token){
            token = req.cookies.token
        } */

        //make sure token exists
        if(!token) {
            console.log('no hay token')
            return next(new ErrorResponse('Unauthorized access to this route',401))
        }

        try {
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('decodeandoles perro',decoded)
            // create acces to user data under req.user
            req.user = await User.findById(decoded.id)
            console.log(req.user)
            next()
        
        } catch (err) {
            console.log('el ultimo catch')
            return next(new ErrorResponse('Unauthorized access to this route',401))
        }
})

//grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} unauthorized`,403))
        }
        next()
    }
}