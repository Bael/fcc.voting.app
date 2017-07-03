var express = require('express');
var router = express.Router();
const passport = require('passport');
const Poll = require('../models/polls');


/* GET home page. */
router.get('/', isAllowed, function(req, res, next) {
  Poll.find({}, function(err, founded) {
    if(err) {
      return next(err);
    } else {
        res.render('polls', { title: 'Polls list' , message:req.flash('message'), polls : founded });
    }
  } )

});



/* GET home page. */
router.get('/new', isAllowed, function(req, res, next) {
  Poll.find({}, function(err, founded) {
    if(err) {
      return next(err);
    } else {
        res.render('newpoll', { title: 'Creating new poll' , message:req.flash('message')});
    }
  } )

});

router.post('/new', isAllowed, function(req, res, next) {
  let {name, option1} = req.body;
  var poll = new Poll({name,  authorId:req.user._id, options:[{name:option1}]});

  poll.save(function(err, created) {
    if(err) {
      return next(err);
    } else {
        res.redirect('/polls/'+created._id);
    }
  } )

});


router.get('/:id', isAllowed, function(req, res, next) {
    Poll.findById(req.params.id, function(err, founded) {
    if(err) {
      return next(err);
    } else {
        res.render('poll', { title: 'Poll info' , message:req.flash('message'), poll : founded, userIsAuthenticated: req.isAuthenticated() });
    }
  })
});

//
router.delete('/:id', isAllowed, function(req, res, next) {

  res.send({status:"success"});

  //console.log("delete id is called! id ='"+req.params.id+"'");
  //res.get('/polls/');

});

router.put('/:id', isAllowed, function(req, res, next) {
    Poll.findById(req.params.id, function(err, founded) {
    if(err) {
      return next(err);
    } else {
      founded.name = res.body.name;
      founded.save();

        //res.render('poll', { title: 'Poll info' , message:req.flash('message'), poll : founded });
    }
  })
});

module.exports = router;


// Check authorization
function isAllowed(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
