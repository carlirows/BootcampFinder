const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')
const { geocode } = require('../utils/geocoder')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req,res, next) => {
        let query;
        //Create a copy of rq.query
        const reqQuery = { ...req.query }

        //specifying fields to exclude from the query
        const removeFields = ['select', 'sort', 'page', 'limit']

        //looping over remove fields, and deleting fields from copy of req.query
        removeFields.forEach(field => delete reqQuery[field])

        console.log(reqQuery)
        
//setUp to use mongoOperators in the query
        //1.creating query string to manipulate
        let queryStr = JSON.stringify(reqQuery)

        //creating mongo filtering operators $gt $gte $lt
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        //finding resource that matches 
        query = Bootcamp.find(JSON.parse(queryStr))

//select
        //once ive found the resource, i can choose to show some or all of its properties
        //select fields /?select=name,description
        if(req.query.select) {               
                const fields = req.query.select.split(',').join(' ');
                console.log(fields)
                query = query.select(fields)
        }

//Sort
        if(req.query.sort) {
                const sortBy = req.query.sort.split(',').join(' ')
                query = query.sort(sortBy) 
        } else {
                query = query.sort('-createdAt')
        }

//pagination
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 25
        const startIndex = (page -1) * limit
        const endIndex = page * limit
        const total = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit)


        //executing the query
        const bootcamps = await query

        //pagination result
        const pagination = {}
        if(endIndex < total){
                pagination.next = {
                        page: page + 1,
                        limit
                }
        }
        if(startIndex > 0) {
                pagination.prev = {
                        page: page -1,
                        limit
                }
        }

        
        res.send({ success: true, count: bootcamps.length, pagination, data: bootcamps })    
 
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
