var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAllowed, function(req, res, next) {
  res.render('profile', { title: 'Profile page', message: req.flash('message') });
});


module.exports = router;

// Check authorization
function isAllowed(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
