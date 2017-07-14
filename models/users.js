const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    salt: String,
    hash: String,
    iteration: Number
})

const users = mongoose.model('users', userSchema);

module.exports = users;
