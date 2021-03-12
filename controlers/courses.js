const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Course = require('../models/Course')

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcamId/courses
//@access Public

exports.getCourses = asyncHandler(async(req,res)=> {
    let query

    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        query = Course.find()
    }

    const courses = await query

    res.send({ succes:true, count: courses.length, data: courses })
})
