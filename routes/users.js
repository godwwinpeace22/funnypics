var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req,res,next){
  res.render('register',{
    title:'Register'
  });
});

router.post('/register', async (req,res,next)=>{
  try {
    req.checkBody('username', 'Please provide a username').notEmpty();
    req.checkBody('password', 'password cannot be empty').notEmpty();
    req.checkBody('password2', 'passwords do not match').equals(req.body.password);
    console.log(req.body)
    //create a new user
    let user = new User({
      username: req.body.username,
      password: req.body.password
    });

    //Run the validators
    let errors = req.validationErrors();
    
    //if there are errors in the form
    if(errors){
      res.status(500).send('There were error in the form')
    }
    //there are no errors
    else{
      //check if ther username is already taken
      let result = await User.findOne({'username': req.body.username})
      //if the username is truely already in user by another user
      if(result){
        console.log('username is already taken');
        res.status(404).send('Username already taken');
      }
      //the username is not already taken
      else{
        let hash = await bcrypt.hash(user.password, 10)
        //set hashed password
        user.password = hash;
        await user.save()
        console.log(user);
        res.send(user);
      } 
    }
  } catch (error) {
    console.log(error);
  }
});

//handle login route
passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(err) {return done(err)}
      if(!user){
        console.log('incorrect username');
        return done(null, false, {message: 'Incorrect username.'});
      }
      bcrypt.compare(password, user.password, function(err, res) {
        if(err) throw err;
        console.log(res);
        // res === true || res === false
        if(res !== true){
          return done(null, false, {message: 'Incorrect password.'});
        }
        else{
          console.log('user has been successfully authenticated');
          return done(null, user);
        }
      });
    });
  }
));

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log('authentication successful!')
    console.log(req.user);
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
   // res.redirect('/users/' + req.user.username);
   res.send(req.user);
});

module.exports = router;
