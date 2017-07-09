const User = require('../models/users');


function getProfile(req, res, next) {
  
    res.render('profile', { title: 'My profile', message: req.flash('message'), currentUser: req.user });
  
}

module.exports.getProfile = getProfile;
