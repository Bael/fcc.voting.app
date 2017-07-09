const Poll = require('../models/polls');


function getIndex(req, res, next) {
  Poll.find({}, (err, founded) => {
    if (err) { return next(err); }

    res.render('index', { title: 'List of polls', message: req.flash('message'), polls: founded, currentUser: req.user });
  });
}

module.exports.getIndex = getIndex;
