const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'please provide a title name for the course']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add duration in weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition cost']
    },
    minimumSkill: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Please add minimum skill level required to enroll']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})
module.exports = mongoose.model('Course', CourseSchema)
//en los cursos vamos a crear una relacion con los bootcamps, entonces debo añadir aqui un campo bootcamp
//que tiene un type especial mongoose.Schema.ObjectId y un campo ref: que hace referencia al modelo que apuntamos