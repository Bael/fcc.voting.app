const User = require('../models/users');
const Poll = require('../models/polls');


function getProfile(req, res, next) {

    const baseUrl = req.protocol + '://' + req.get('host') + '/';
    Poll.find({ authorId: req.user._id }, function(err, founded, pageInfo) {
        if (err) {
            return next(err);
        } else {
            res.render('profile', {
                title: 'My profile',
                message: req.flash('message'),
                polls: founded,
                currentUser: req.user,
                baseUrl
            });
        }
    });
}


///res.render('profile', { title: 'My profile', message: req.flash('message'), currentUser: req.user });



module.exports.getProfile = getProfile;