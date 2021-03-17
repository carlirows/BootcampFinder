const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')
const User = require('../models/User')
const { red } = require('colors')

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register= asyncHandler(async(req, res, next)=> {
    const { name, email, password, role } = req.body

    //User creation
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    //genero el token para mi usuario accediendo al metodo ue cree en el modelo
    sendTokenResponse(user, 200, res)
})

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login= asyncHandler(async(req, res, next)=> {
    const { email, password } = req.body

    //validation of email and password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide both email and password', 400))
    }

    //check if user is in databas
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //check if password matches
    const isMatch = await user.matchPassword(password)
   
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))

    }
    //genero el token para mi usuario accediendo al metodo ue cree en el modelo
   sendTokenResponse(user, 200, res)
})

//get token from moder, create cookie, send response
const sendTokenResponse = (user, statusCode, res)=> {
    //create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res
    .status(statusCode)
    //la cookie simplemente se la anexo al objeto res, recibe 1.key/nombre 2.value/token itself y 3. las opciones
    .cookie('token', token, options)
    .send({success: true, token})
}

//@desc Get current logged ib user
//@route get /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    console.log(user)
    res.send({
        success: true,
        data: user
    });
})