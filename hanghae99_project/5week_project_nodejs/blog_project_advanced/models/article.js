const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true  
    },

    author : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now
    },
    
    comment : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Com'
    },

});


module.exports = mongoose.model('Article', articleSchema)
