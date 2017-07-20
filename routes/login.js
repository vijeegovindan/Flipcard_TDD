const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
var crypto =  require("crypto");
const users = require('../models/users');

mongoose.Promise = require('bluebird');

routes.get("/", function(req, res){
  res.render("login");
});

routes.get("/login", function(req, res){
  res.render("login");
});

routes.post('/login',function(req, res){

  let errors = "";
  let messages = [];

  req.checkBody("username", "Please enter username").notEmpty();
  req.checkBody("password", "Please enter password").notEmpty();

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render("login",{ errors: util.inspect(result.array()),
                            sessionExist:req.session.username})
    }
    else{
      users.findOne({username: req.body.username})
         .then(function(user){
          if(!user)
          {
            res.render ("login", {messages: "User not found"})
          }
          else {
             var config = {
                 keylen: 512,
                 digest: 'sha512'
             };
               var query = users.findOne({username: req.body.username});
               query.select('hash salt iteration');
               query.exec(function(err, result) {
               var savedHash = result.hash;
               var savedSalt = result.salt;
               var savedIterations = result.iteration;
               var hash = crypto.pbkdf2Sync(req.body.password, savedSalt, savedIterations, config.keylen, config.digest);
               var hashedPassword = hash.toString('base64');
               if(savedHash === hashedPassword){
                 req.session.username = req.body.username;
                 res.redirect("flipcard");
               }
               else {
                   res.render("login", {messages: "Enter a valid username and password"});
               }
              });
            }
        });
      }
    });
});

module.exports = routes
