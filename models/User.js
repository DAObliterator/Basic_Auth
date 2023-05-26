const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ( {
    username: {
        type: String,
        required: true,
        min: 6,
        max: 10
    },
    password: {
        type: String,
        required: true,
        min:8,
        max:20
    }
})

const User = mongoose.model( 'User' , UserSchema );
module.exports = User;