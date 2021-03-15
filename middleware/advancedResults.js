const advancedResults = (model, populate) => async (req, res, next) => {
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
        query = model.find(JSON.parse(queryStr))

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
        const total = await model.countDocuments()

        query = query.skip(startIndex).limit(limit)

if(populate) {
    query = query.populate(populate)
}


        //executing the query
        const results = await query

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

        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results
        }

        next()
}
 


 module.exports = advancedResults