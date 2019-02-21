var mongoose = require('mongoose');
 
var authorSchema = mongoose.Schema({
    username: { type : String , unique : true, required : true },
    password: { type : String, required : true },
    place: { type : String },
    incognito:{type:Boolean},
    lat:{type:String},
    lag:{type:String},
    geo: {
        type: [Number],
        index: '2d'
      }
});
 
var User = mongoose.model('users', authorSchema);
 
module.exports = User;