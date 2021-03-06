const path = require('path')
const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req,res, next) => {
        res.send(res.advancedResults)    
 
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
        //add user to req.body
        // tomo el id del user logueado y se lo paso a req.body para que al cear el bootcamp tenga la info del usuario
        req.body.user = req.user.id

        //check for published bootcamps
        const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})

        //if the user is not an admin they can create only one bootcamp
        if(publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`the user with the ID ${req.user.id} has already published a bootcamp`, 400))
}

         const bootcamp = await Bootcamp.create(req.body)
        res.send({ success: true, count: bootcamp.length, data:bootcamp  })        
})

//@desc Put bootcamp by id
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        let bootcamp = await Bootcamp.findById(req.params.id);
      
        if (!bootcamp) {
          return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
          );
        }
      
        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.params.id} is not authorized to update this bootcamp`,
              401
            )
          );
        }
      
        bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });
      
        res.status(200).json({ success: true, data: bootcamp });
      });

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async(req,res,next) => { 
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`, 404))
        }
               // Make sure user is bootcamp owner
               if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return next(
                  new ErrorResponse(
                    `User ${req.params.id} is not authorized to delete this bootcamp`,
                    401
                  )
                );
              }
        
        bootcamp.remove()    
        res.send({ success: true, data: bootcamp })
 
})


//@desc Upload bootscamps photo
//@route DELETE /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async(req,res,next) => { 
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcam with ID ${req.params.id} not found`, 404))
        }

         // Make sure user is bootcamp owner
         if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return next(
                  new ErrorResponse(
                    `User ${req.params.id} is not authorized to upload photos`,
                    401
                  )
                );
              }
        
        if(!req.files){
            return next(new ErrorResponse(`Please upload a file`, 400))
        }
        const file = req.files.file

        //make sure us an image
        if(!file.mimetype.startsWith('image')){
                return next(new ErrorResponse(`Please upload a valid image file`, 400))  
        }
        if(file.size > process.env.MAX_FILE_UPLOAD) {
                return next(new ErrorResponse(`Please upload an image smaller than ${process.env.MAX_FILE_UPLOAD}`, 400)) 
        }
        file.name= `photo_${bootcamp._id}${path.parse(file.name).ext}`
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
                if(err){
                    console.log(err)
                    return next(new ErrorResponse(`Problem with file upload`, 500)) 
                }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})
        res.status(200).send({success: true, data: file.name})

        })
        
})


//@desc get bootcamp within radius
//@route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async(req,res,next) => { 
        const {zipcode, distance} = req.params
        //get lat and long from zipcode using geocoder
        const loc = await geocoder.geocode(zipcode)
        const lat = loc[0].latitude
        const lng = loc[0].longitude
        //calculate radius using radians = divide distance by earth's radius 10 / 3963mi
        const radius = distance / 3963
        const bootcamps = await Bootcamp.find( {
                location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
              } )
        res.send({
                success: true,
                count: bootcamps.length,
                data: bootcamps
        })
})
