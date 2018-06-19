const express = require('express');
const router = express.Router();
const Image = require('../models/image')
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
        }
      });
      await image.save();
      console.log(image);
    });
    res.send('Images uploaded successfully');
  } catch (error) {
    console.log(error);
  }
});

// Client-side request
router.get('/images/:offset', async (req,res,next)=>{
  someFiles = await Image.find().skip(1 * req.params.offset).limit(4);
  res.send(someFiles)
})
module.exports = router;
