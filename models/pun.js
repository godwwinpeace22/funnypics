const mongoose = require('mongoose');
const Schema = mongoose.Schema
module.exports = mongoose.model('Pun', new Schema({
  content:String,
  likes:Array,
  created_at:Date
}))