const express = require('express')
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controlers/bootcamps')

const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/bootcamp')

//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router()

//re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/:id/photo').put(bootcampPhotoUpload)

router
    .route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'),getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)
    

module.exports = router