const passport = require('passport');
const Poll = require('../models/polls');

// get all polls
module.exports.getList = function (req, res, next) {
  Poll.find({}, function (err, founded) {
    if (err) {
      return next(err);
    } else {
      res.render('polls', {
        title: 'Polls list',
        message: req.flash('message'),
        polls: founded
      });
    }
  });
}

// get new poll info
module.exports.getNewInstance = function (req, res, next) {
  res.render('newpoll', {
    title: 'Creating new poll',
    message: req.flash('message')
  });

};

/// fill name and options text
function fillPollInfo(poll, req) {
      poll.name = req.body.name;
      
      for (var i=0; i<req.body.pollOption.length; i++)
      {
        var option = req.body.pollOption[i];
        if (!poll.hasOption(option))
        {
          poll.options.push({name: option, votes: 0});
        }
      }
}

// save new poll
module.exports.createNewPoll = function (req, res, next) {
  
  var poll = new Poll({
     authorId: req.user._id,
  });

  fillPollInfo(poll, req);
    for (var i=0; i<req.body.pollOption.length; i++)
      {
        var option = req.body.pollOption[i];
        if (!poll.hasOption(option))
        {
          poll.options.push({name: option, votes: 0});
        }
      }

  poll.save(function (err, created) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/polls/' + created._id);
    }
  })

};

// get poll by id
module.exports.getById = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {
      res.render('poll', {
        title: 'Poll info',
        message: req.flash('message'),
        poll: founded,
        userIsAuthenticatedAndAuthor: (req.isAuthenticated() && founded.authorId === req.user._id)
      });
    }
  })
};

// delete poll by id
module.exports.deleteById = function (req, res, next) {
  Poll.remove({_id:req.params.id}, function (err, result) {
    if (err) {
      return next(err);
    }
    res.send({
      status: "successfully deleted"
    });
  })

};

// update poll
module.exports.updatePoll = function (req, res, next) {
  console.log("req.params.id is "+ req.params.id);
  console.log(JSON.stringify(res.body));
  Poll.findById(req.params.id, function (err, founded) 
  {
    if (err) {
      console.log(err);
      return next(err);
    } else {

      fillPollInfo(founded, req);
      founded.save(function(err, success) {
        if(err) return next(err);

        console.log(JSON.stringify(founded));
        res.render('poll', { title: 'Poll info' , message:"poll saved!", poll : success, userIsAuthenticatedAndAuthor: (req.isAuthenticated() && success.authorId === req.user._id) });
      });
    }
  })
};


// get poll by id
module.exports.getForVoteById = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {
      res.render('pollvote', {
        title: 'Poll vote info',
        message: req.flash('message'),
        poll: founded
      });
    }
  })
};

module.exports.getVoteResultById = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {

      var result = {labels:[], data : []};

      for (var i=0; i<founded.options.length; i++) {
          result.labels.push(founded.options[i].name);
          result.data.push(founded.options[i].votes);
      }
      res.send(result);
    }
  })
};

module.exports.vote = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {

      console.log(JSON.stringify(req.body));
      let userInfo = {ip:req.ip};

      if (req.isAuthenticated()) {
         userInfo.userId = req.user._id; 
      }
      
      founded.vote(req.body.pollOption, userInfo);
      founded.save(function(err, savedPoll) {
        res.render('pollvoteresult', {
        title: 'Poll voting info',
        message: req.flash('message'),
        poll: savedPoll
      });

      });

    }
  })
};
