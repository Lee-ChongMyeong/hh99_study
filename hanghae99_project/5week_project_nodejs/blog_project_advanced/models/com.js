const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({

    // commenter:{  // 댓글이 달리게 되는 게시물
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Article',
    //     required:true
    // },   // 1
    
    author:{  // 댓글 작성자    -> 닉네임
        type: String,//mongoose.Schema.Types.ObjectId,
        //ref:'User',
        required:true
    }, // 1

    comment : {
        type : String,
    },

    createdAt : {
        type : Date,
        default : Date.now
    },


})


module.exports = mongoose.model('Com', commentSchema)
