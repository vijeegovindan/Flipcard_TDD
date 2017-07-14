const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    deckid: { type: Number, required: true, unique: true },
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'users'}
})

const decks = mongoose.model('decks', deckSchema);

module.exports = decks;
