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

// Initailize cloud firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newproject-72f76.firebaseio.com"
});

var db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sonrisa' });
});

router.post('/', upload.array('src'), async (req,res,next)=>{
  console.log(req.files);
  let imgs = []
  let docs = req.files
  docs.forEach(doc => {
    let image = new Image({
      src:doc.secure_url,
      data:{
        width:doc.width,
        height:doc.height
      }
    });
    await image.save()
    console.log(image);
    imgs.push(image)
  });
  res.send(imgs)
})

module.exports = router;
