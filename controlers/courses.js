const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Course = require('../models/Course')
const Bootcamp = require('../models/bootcamp')

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async(req,res)=> {
    let query

    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        //aqui no solo encuentro el recurso pero le digo que me muestre algo mas que solo el id, que lo llene con el nombre y la desc del bootcamp
        //si a populate le paso solo el campo que quiero llena 'bootcamp' nos trae toda la info del bootcamp
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query

    res.send({ succes:true, count: courses.length, data: courses })
})

//@desc Get course
//@route GET /api/v1/courses/id
exports.getCourse = asyncHandler(async(req,res, next)=> {
    const course = (await Course.findById(req.params.id)).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!course){
        return next(new ErrorResponse(`no course with such id`, 404))
    }

    res.send({ succes:true, data: course })
})

//@desc Create course
//@route POST /api/v1/courses
//@route POST /api/v1/bootcamps/:bootcampId/courses
exports.addCourse = asyncHandler(async(req,res, next)=> {
    //al body que envio le añado como propiedad bootcamp, 
    //el valor del id que llega por params, creadno asi la relacion entre uno y otro
    req.body.bootcamp = req.params.bootcampId
     
    const bootcamp = (await Bootcamp.findById(req.params.bootcampId))
   
    if(!bootcamp){
        return next(new ErrorResponse(`unable to find bootcamp with id ${req.params.bootcampId}`, 404))
   }

   const course = await Course.create(req.body)

    res.send({ succes:true, data: course })
})

//@desc update course
//@route Put /api/v1/courses/:id

exports.updateCourse = asyncHandler(async(req,res, next)=> {

  let course = await Course.findById(req.params.id)

  if(!course){
    return next(new ErrorResponse(`unable to find course with id ${req.params.id}`, 404))
}
  console.log('ENCUENTRO EL C_URSO:::::::::::::::::::', course)
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }) 
    console.log('SE VA MTODO A LA MIERDA'.red ,course)
    
    res.send({ succes:true, data: course })
})


//@desc delete course
//@route DELETE /api/v1/courses/:id

exports.deleteCourse = asyncHandler(async(req,res, next)=> {

  const course = await Course.findById(req.params.id)

  if(!course){
    return next(new ErrorResponse(`unable to find course with id ${req.params.id}`, 404))
}
  await course.remove()
    
    res.send({ succes:true, data: course })
})
