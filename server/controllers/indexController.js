function getIndex(req, res, next) {
    res.render('index', { title: 'Home page', message: req.flash('message'), polls: [], currentUser: req.user });

}

module.exports.getIndex = getIndex;