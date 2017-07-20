const routes = require("express").Router();
const mongoose = require("mongoose");
const Promise = require("bluebird");
const users = require('../models/users');
const decks = require('../models/decks');
const cards = require('../models/cards');

routes.get("/playcards", function(req,res){
var messages;
if(req.query.bool == "t"){
  messages = "You win!"
}else if(req.query.bool == "f"){
  messages = "Try again!"
}
else {
  messages = "";
}
cards.count().exec(function (err, count) {
var random = Math.floor(Math.random() * count)
  cards.findOne().skip(random).exec(
    function (err, result) {
      res.render("playcards", {result:result, messages:messages});
    });
  });
});

routes.post('/playcards/:id/submit', function(req,res){
  cards.findOne({_id:req.params.id}).then(function(result){
    if(req.body.answer == result.answer){
      res.redirect("/playcards?bool=t");
    }
    else {
      res.redirect("/playcards?bool=f");
    }
  });
});

module.exports = routes;
