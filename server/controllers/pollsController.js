const passport = require('passport');
const Poll = require('../models/polls');

// get all polls
module.exports.getList = function(req, res, next) {
  Poll.find({}, function(err, founded) {
    if(err) {
      return next(err);
    } else {
        res.render('polls', { title: 'Polls list' , message:req.flash('message'), polls : founded });
    }
  });
}

// get new poll info
module.exports.getNewInstance = function(req, res, next) {
  res.render('newpoll', { title: 'Creating new poll' , message:req.flash('message')});

};

// save new poll
module.exports.createNewPoll = function(req, res, next) {
  let {name, option1} = req.body;
  var poll = new Poll({name,  authorId:req.user._id, options:[{name:option1}]});

  poll.save(function(err, created) {
    if(err) {
      return next(err);
    } else {
        res.redirect('/polls/'+created._id);
    }
  })

};

// get poll by id
module.exports.getById = function(req, res, next) {
    Poll.findById(req.params.id, function(err, founded) {
    if(err) {
      return next(err);
    } else {
        res.render('poll', { title: 'Poll info' , message:req.flash('message'), poll : founded, userIsAuthenticated: req.isAuthenticated() });
    }
  })
};

// delete poll by id
module.exports.deleteById = function(req, res, next) {

  res.send({status:"success"});

  //console.log("delete id is called! id ='"+req.params.id+"'");
  //res.get('/polls/');

};

// update poll
module.exports.updatePoll =  function(req, res, next) {
    Poll.findById(req.params.id, function(err, founded) {
    if(err) {
      return next(err);
    } else {
      founded.name = res.body.name;
      founded.save();

        //res.render('poll', { title: 'Poll info' , message:req.flash('message'), poll : founded });
    }
  })
};
