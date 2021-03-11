const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be longer than 50 char'] 
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'please add a description'],
        maxlength: [500, 'Description can not be longer than 500 char']
    },
    website:{
        type: String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please add a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'phone number can not be longer than 20 characters']
    },
    email:{
        type:String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid Email'
        ]
    },
    address: {
        type: String,
        required: [true, 'please add an address']
    },
    location: { 
        // GeoJSON tomado de la documentacion de mongoose
        type: {
            type: String,
            enum: ['Point']
          },
          coordinates: {
            type: [Number],
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [ // enum signifia que solo puede tomar los valores proporcionados en el array
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be greater than 10'],
    },
    averageCost: Number,
    photo:{
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type:Boolean,
        default: false
    },
    jobAssistance: {
        type:Boolean,
        default: false
    },
    jobGuarantee: {
        type:Boolean,
        default: false
    },
    acceptGi: {
        type:Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

//create bootcamp slug from name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower:true}) //lower es una opcion para que me pase todo a minuscula
    next()
})

//Geocode and location field

BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].streetName,
        country: loc[0].countryCode,
    }
    // we just needed the address to geocode the location, it doesnt need to be saved to db
    this.address = undefined
    next()
})


module.exports = mongoose.model('Bootcamp', BootcampSchema)