const express = require('express');

const router = express.Router();

// Check authorization
function isAllowed(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

/* GET home page. */
router.get('/', isAllowed, (req, res, next) => {
  res.render('profile', { title: 'Profile page', message: req.flash('message') });
});


module.exports = router;
