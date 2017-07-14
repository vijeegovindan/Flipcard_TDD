const routes = require('express').Router();
const users = require('../models/users');
const mongoose = require('mongoose');
var util = require('util');
var crypto =  require("crypto");

routes.get("/signup", function(req, res){
  res.render("signup", {sessionExist:req.session.username});
});
//Get the display name, username, password from the user
//New user registration with validations
routes.post("/signup", function(req, res){

  let errors = "";
  let messages = [];

  req.checkBody("username", "Please enter a valid username").notEmpty().isLength({max: 30});
  req.checkBody("password", "Please enter a Password").notEmpty();

  req.getValidationResult().then(function(result){

      if(!result.isEmpty()){
        res.render("signup",{ errors: util.inspect(result.array()),
                              sessionExist:req.session.username})
      }
      else{
            var hash_password = hashPassword(req.body.password);

            let usersInstance = new users({
            username: req.body.username,
            salt: hash_password.salt,
            hash: hash_password.hash,
            iteration: hash_password.iterations
            });

            usersInstance.save(function(err){
            if(!err){
              req.session.username = req.body.username;
              res.render("login", {sessionExist:req.session.username});
            }
            else{
              res.render("signup", {messages:"Error adding user"});
            }
          });
        }
    });
  });

  var config = {
    salt: function(length){
      return crypto.randomBytes(Math.ceil(32*3/4)).toString('base64').slice(0, length);
    },
    iterations: 20000,
    keylen: 512,
    digest: 'sha512'
  }

function hashPassword(passwordinput){
    var salt = config.salt(32);
    var iterations = config.iterations;
    var hash = crypto.pbkdf2Sync(passwordinput, salt, iterations, config.keylen, config.digest);
    var hashedPassword = hash.toString('base64');

    return {salt: salt, hash: hashedPassword, iterations: iterations};
  }

module.exports = routes;
