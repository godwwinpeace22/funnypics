const mongoose = require('mongoose');
const Schema = mongoose.Schema
module.exports = mongoose.model('Riddle', new Schema({
  title:String,
  question:String,
  answer:String,
  created_at:String,
  likes:Array
}))