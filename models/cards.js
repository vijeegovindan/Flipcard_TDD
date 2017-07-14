const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  deckid : {type: mongoose.Schema.Types.ObjectId, ref:'decks'},
  question : {type: String},
  answer : {type: String}
})

const cards = mongoose.model('cards', cardSchema);

module.exports = cards;
