
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const user = require('../model/user')


const database = require('../config/database')

var returnrouter = function(io, passport){
  router.post('/register', (req, res, next) => {
    console.log(req.body)
 let newUser = new user.user(req.body.name, req.body.email, req.body.password, req.body.username);
 console.log(newUser)
 database.addUser(newUser, (err, user) =>{
     if(err)(
         res.json({success : false, msg: "failed to register user"})
     ) 
     else(
        res.json({success : true, msg: "user registered"})
     )
 });
 
 
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  database.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'})
    }
    console.log(user)
    database.comparePassword(password, user.PASSWORD, (err, isMatch) =>{
      if(err) throw err;

      if(isMatch){
        const token = jwt.sign({data:user}, database.secret,{
          expiresIn: 604800 //1 week
      });
      
      res.json({success: true, token: token, user:{name: user.name, username: user.username, email: user.email}})
      }
      else{
        return res.json({success: false, msg: 'Password didnt match'})
      }
    })
  })
});

// Profile
io.on('connection', function(socket) {
  console.log(socket.decoded_token.data)
  socket.emit('success', socket.decoded_token.data);
  // in socket.io 1.0
  console.log('hello! ', socket.decoded_token.data.name);
  console.log('Authentication passed!');
});
 

// Validate
router.get('/validate', (req, res, next) => {
  res.send('VALIDATE');
});
return router;
}
// Register


module.exports = returnrouter;
