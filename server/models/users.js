// Import Mongoose and password Encrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for User model
const userSchema = mongoose.Schema({
    // Using local for Local Strategy Passport
    local: {
        name: String,
        email: String,
        password: String,
    },
    twitter: {
        id: String,
        name: String
    }

}, { runSettersOnQuery: true });

// Encrypt Password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Verify if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getName = function() {
    return this.local.name;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);