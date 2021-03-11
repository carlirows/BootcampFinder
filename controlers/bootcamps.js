const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = async (req,res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.send({ success: true, count: bootcamps.length, data: bootcamps })    
    } catch (err) {
       res.status(400).send({success: false })
       
    }
}

//@desc Get bootcamp by id
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = async(req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`,))
        }
        res.send({ success: true, data: bootcamp })
    } catch (err) {
        //res.status(404).send({ success: false })    
        next(err)
    }    
}

//@desc Post bootcamp by id
//@route POST /api/v1/bootcamps/
//@access private
exports.createBootcamp = async(req,res) => {
   try {
        const bootcamp = await Bootcamp.create(req.body)
        res.send({ success: true, count: bootcamp.length, data:bootcamp  })    
    } catch (err) {
       res.status(400).send({ success: false })       
   }
    
}

//@desc Put bootcamp by id
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = async(req,res) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp){
            res.status(404).send({ success: false, error: 'no bootcamp matches the Id provided' })
        }
    
        res.send({ success: true, data: bootcamp })
    } catch (err) {
        res.status(404).send({ success: false })
    }
    
}

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = async(req,res) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            res.status(404).send({ success: false, error: 'no bootcamp matches the Id provided' })
        }
    
        res.send({ success: true, data: bootcamp })
    } catch (err) {
        res.status(404).send({ success: false })
    }
}
