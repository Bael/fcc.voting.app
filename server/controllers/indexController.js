function getIndex(req, res, next) {
    res.render('index', { title: 'Home page', message: req.flash('message'), polls: [], currentUser: req.user });

}

function getHelpPage(req, res, next) {
    res.render('help', { title: 'Help page', message: req.flash('message'), polls: [], currentUser: req.user });

}


module.exports.getHelpPage = getHelpPage;

module.exports.getIndex = getIndex;