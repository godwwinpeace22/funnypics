const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema
module.exports = mongoose.model('User', new Schema({
    username:String,
    password:{
        type:String,
        bcrypt: true
    },
    likes:Array
}))