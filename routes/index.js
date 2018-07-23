const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const cloudinary = require('cloudinary');
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');

// Configure cloud storage
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

var storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: 'funnypics',
allowedFormats: ['jpg', 'png'],
filename: function (req, file, cb) {
  cb(undefined, 'src' + Date.now());
}
});

let upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sonrisa' });
});

router.post('/', upload.array('src'), async (req,res,next)=>{
  try {
    let docs = req.files
    docs.forEach(async doc => {
      let image = new Image({
        src:doc.secure_url,
        data:{
          width:doc.width,
          height:doc.height
        },
        likes:0,
        shares:0
      });
      await image.save();
      console.log(image);
    });
    res.send('Images uploaded successfully');
  } catch (error) {
    console.log(error);
  }
});

// Client-side request for images
router.get('/images/:offset', async (req,res,next)=>{
  someFiles = await Image.find().skip(1 * req.params.offset).limit(20);
  res.send(someFiles)
})

// client-side request to like or unlike images
router.post('/images/like/:userId/:imgId/:action', async (req,res,next)=>{
  try {
    let targetImg = await Image.findOne({_id:req.params.imgId})
    let targetUser = await User.findOne({_id:req.params.userId})
    console.log(targetImg)
    console.log(targetUser)
    let addlike = targetImg.likes * 1 + 1
    let sublike = targetImg.likes * 1 - 1
    let userlikes = targetUser.likes
    switch(req.params.action){
      
      case 'like':
        userlikes.push(req.params.imgId)
        let res1 = await Image.findOneAndUpdate({_id:req.params.imgId}, {likes:addlike}, {new:true})
        let userUpdate = await User.findOneAndUpdate({_id:req.params.userId}, {likes:userlikes}, {new:true})
        console.log(res1)
        console.log(userUpdate)
        res.send({user:userUpdate,done:'now liked'})
        break;

      case 'unlike':
      userlikes.splice(userlikes.indexOf(req.params.userId),1)
        let res2 = await Image.findOneAndUpdate({_id:req.params.imgId}, {likes:sublike}, {new:true})
        let userUpdate2 = await User.findOneAndUpdate({_id:req.params.userId}, {likes:userlikes}, {new:true})
        console.log(res2)
        console.log(userUpdate2)
        res.send('now unliked')
        break;
    }
  } catch (error) {
    throw error
  }
  
})
module.exports = router;
