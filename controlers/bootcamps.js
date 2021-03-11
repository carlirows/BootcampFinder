const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req,res, next) => {
  
        const bootcamps = await Bootcamp.find()
        res.send({ success: true, count: bootcamps.length, data: bootcamps })    
 
})

//@desc Get bootcamp by id
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async(req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`, 404))
        }
        res.send({ success: true, data: bootcamp })  
})

//@desc Post bootcamp by id
//@route POST /api/v1/bootcamps/
//@access private
exports.createBootcamp = asyncHandler(async(req,res,next) => {
         const bootcamp = await Bootcamp.create(req.body)
        res.send({ success: true, count: bootcamp.length, data:bootcamp  })        
})

//@desc Put bootcamp by id
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async(req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`, 404))
        }    
        res.send({ success: true, data: bootcamp })   
})

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async(req,res,next) => { 
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`, 404))
        }    
        res.send({ success: true, data: bootcamp })
 
})
