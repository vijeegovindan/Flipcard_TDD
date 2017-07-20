const routes = require("express").Router();
const mongoose = require("mongoose");
const Promise = require("bluebird");
const users = require('../models/users');
const decks = require('../models/decks');
const cards = require('../models/cards');

routes.get("/edit",  function(req, res) {
    var sqlfind;
    var deckid;
    var messages;

    if(req.query.success){
      messages = "Successfully updated";
    }
    sqlfind = cards.findOne({_id:req.query.id});
    sqlfind.select("deckid question answer");
    sqlfind.exec(function(err,result){
      if(!err){
          result = result;
          decks.findOne({_id:result.deckid}).then(function(deck){
          res.render("edit", {result:result, deck:deck, messages:messages});
        });
      }
    });
});

routes.post("/edit",  function(req, res) {
    cards.findByIdAndUpdate(
      {_id:req.body.cardid},
      {$set: {
          question: req.body.question,
          answer: req.body.answer}
      },
      function(err, card){
        console.log(res);
        res.redirect("/edit?id="+req.body.cardid + "&success=true");
      }
    );
});

module.exports = routes;
