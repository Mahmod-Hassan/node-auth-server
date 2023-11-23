const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
})
module.exports = userSchema;