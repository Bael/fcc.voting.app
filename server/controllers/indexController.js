const Poll = require("../models/polls");


module.exports.getIndex = getIndex;

function getIndex(req, res, next) {
    Poll.find({}, function (err, founded) {
        if (err)
            return next(err);

        res.render('index', { title: 'Express', message: req.flash('message'), polls: founded });
    }

    )
}