const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = {...err}

    error.message = err.message

    //console.log('ERROR::'.red, err.name)
    if(err.name === 'CastError'){
        const message = `Resource not found under id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    res.status(error.statusCode || 500).send({success: false, error: error.message || 'Server error'})
  }

  module.exports = errorHandler