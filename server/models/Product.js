const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    product:{
        type:String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type:String,
        required: true,
    },
    quantity:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required: true,
    },
    quantitySell:{
        type:String
    },
    code:{
        type:String,
        require:true
    },

    user:{
            type: Schema.Types.ObjectId,
            ref: 'users'
    }

    
})

module.exports = mongoose.model('product',ProductSchema)