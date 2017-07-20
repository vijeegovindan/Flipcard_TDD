const routes   = require("express").Router();
const mongoose = require("mongoose");
const Promise  = require("bluebird");
const users   = require('../models/users');
const decks   = require('../models/decks');
const cards   = require('../models/cards');
var util      = require('util');

routes.get("/flipcard", function(req, res){
 cards.find().then(function(card){
  res.render("flipcard", {sessionExist:req.session.username, list:card});
  })
});

routes.post("/flipcard/new", function(req,res){

let errors = "";
let messages = [];

req.checkBody("deckname","Please enter the deck name").notEmpty().isLength({max:50});
req.checkBody("question","Please enter the question").notEmpty().isLength({max:200});
req.checkBody("answer","Please enter the answer").notEmpty().isLength({max:200});

req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render("flipcard", {messages: util.inspect(result.array()),
                             sessionExist:req.session.username}
    )}
    else {
        var query;
        var userId;
        var deck;
        if(!req.session.username){
            res.redirect("/login");
        }
        else {
            query = users.findOne({username:req.session.username});
            query.select('_id');
            query.exec(function(err, result){
            userId = result._id;
            if(userId){
                let newDeck = new decks({
                  deckName: req.body.deckname,
                  userId: userId
                });
                newDeck.save(function(err){
                  let newCard = new cards({
                  deckid: newDeck._id,
                  question: req.body.question,
                  answer: req.body.answer
                });
                newCard.save(function(deck){
                  deck = deck;
                  res.redirect("/flipcard");
                })
              });
            }
      })  }
    }
})
}) // POST : /flipcard
routes.post("/flipcard/:id/delete",  function(req, res) {
    cards.findOneAndRemove({_id:req.params.id}, function(err, card){
      res.redirect("/flipcard");
    });
});

routes.post("/flipcard/:id/update", function(req,res){
  cards.findOne({_id:req.params.id}).then(function(card){
    res.redirect("/edit?id="+req.params.id);
  });
});

module.exports = routes;
