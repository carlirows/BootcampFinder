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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

//statics es para usar directamente sobre el modelo
CourseSchema.statics.getAverageCost = async function(bootcampId){
    console.log('Calculating avg cost'.blue)
    //la funcion aggregate procesa datos y los devuelve ya computados, toma todos los totales y devuelve un promedio,
    // toma todos los valores de productos y devuelve un total
    const obj = await this.aggregate([
        { //primero filtramos los documentos segun el campo bootcamp
            $match: {bootcamp: bootcampId} 
        },
        {//luego agrupo los documentos restantes segun su custom_id
            $group: {//despues creo un campo averageCost que es el resultado de aplicar una operacion sobre el cammpo tuition de los objetos agrupados
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition'}
            }
        }
    ])
    try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
          averageCost: Math.ceil(obj[0].averageCost/10)*10
      })
    } catch (err) {
        console.log(err)
    }
}

//Call getAverageCost after save
CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp)
})

//Call getAverageCost before remove
CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
//en los cursos vamos a crear una relacion con los bootcamps, entonces debo añadir aqui un campo bootcamp
//que tiene un type especial mongoose.Schema.ObjectId y un campo ref: que hace referencia al modelo que apuntamos