const passport = require('passport');
const Poll = require('../models/polls');

const pageSize = 3;


module.exports.getPage = function (req, res, next) {
  
  const currentPage = req.query.page || 1;
  console.log('requested page is ' + req.query.page);

  Poll.count({}, function (err, count) {

      if (err) {
        return next(err) 
      }
      
      const pagesCount = count / pageSize;

      Poll.find({}).skip((currentPage-1) * pageSize).limit(pageSize).exec(function (err, founded) {
      if (err) {
        return next(err);
      } else {
        res.render('polls', {
          title: 'Polls list',
          message: req.flash('message'),
          polls: founded,
          currentUser: req.user,
          pageInfo: {pageSize,
          currentPage,
          pagesCount}
        });
      }
    });

  }) 

};


// get new poll info
module.exports.getNewInstance = function (req, res, next) {
  res.render('newpoll', {
    title: 'Creating new poll',
    message: req.flash('message'),
    currentUser: req.user
  });

};

/// fill name and options text
function fillPollInfo(poll, req) {
  poll.name = req.body.pollName;

  for (var i = 0; i < req.body.pollOption.length; i++) {
    var option = req.body.pollOption[i];
    if (!poll.hasOption(option)) {
      poll.options.push({
        name: option,
        votes: 0
      });
    }
  }
}

// save new poll
module.exports.createNewPoll = function (req, res, next) {

  var poll = new Poll({
    authorId: req.user._id,
  });

  fillPollInfo(poll, req);
  for (var i = 0; i < req.body.pollOption.length; i++) {
    var option = req.body.pollOption[i];
    if (!poll.hasOption(option)) {
      poll.options.push({
        name: option,
        votes: 0
      });
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
    } 
      res.render('poll', {
        title: 'Poll info',
        message: req.flash('message'),
        poll: founded,
        userIsAuthenticatedAndAuthor: (req.isAuthenticated() && founded.authorId.equals(req.user._id)),
        currentUser: req.user,
      });
    
  });
};

// delete poll by id
module.exports.deleteById = function (req, res, next) {
  Poll.remove({
    _id: req.params.id
  }, function (err, result) {
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
  console.log("req.params.id is " + req.params.id);
  console.log(JSON.stringify(res.body));
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      console.log(err);
      return next(err);
    } else {

      fillPollInfo(founded, req);
      founded.save(function (err, success) {
        if (err) return next(err);

        console.log(JSON.stringify(founded));
        res.render('poll', {
          title: 'Poll info',
          message: "poll saved!",
          poll: success,
          userIsAuthenticatedAndAuthor: (req.isAuthenticated() && success.authorId === req.user._id),
          currentUser: req.user
        });
      });
    }
  })
};


// get poll by id
module.exports.getForVoteById = getForVoteById;

function getForVoteById(req, res, next) {
  Poll.findById(req.params.id, (err, founded) => {
    if (err) {
      next(err);
    } else {
      res.render('pollvote', {
        title: 'Poll vote info',
        message: req.flash('message'),
        poll: founded,
        currentUser: req.user
      });
    }
  });
}


module.exports.getVoteResultPage = function(req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {
        res.render('pollvoteresult', {
              title: 'Poll voting info',
              message: req.flash('message'),
              poll: founded,
              currentUser: req.user
            });
    }

   
  });
}
module.exports.getVoteResultById = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {

      const result = {
        type:'pie',
        labels: [],
        data: [],
        backgroundColors: [],
        borderColors: []
      };

      const colors =  ['#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728'];

      for (let i = 0; i < founded.options.length; i++) {
        result.labels.push(founded.options[i].name+":"+founded.options[i].votes);
        result.data.push(founded.options[i].votes);
        result.backgroundColors.push(colors[i % colors.length]);
        result.borderColors.push('#000000');
      }


      res.send(result);
    }
  });
};

module.exports.vote = function (req, res, next) {
  Poll.findById(req.params.id, function (err, founded) {
    if (err) {
      return next(err);
    } else {

      // console.log(JSON.stringify(req.body));
      let userInfo = {
        ip: req.ip
      };

      if (req.isAuthenticated()) {
        userInfo.userId = req.user._id;
      }


      if (founded.userHasVoted(userInfo)) {
        res.render('pollvote', {
            title: 'Poll voting info',
            message: "You've already voted for this poll!",
            poll: founded,
            currentUser: req.user
          });

      } else { 
        founded.vote(req.body.pollOption, userInfo);
        founded.save(function (err, savedPoll) {
          if (err) {
            console.log("Error ocuured while voting "+err.toString());
            next(err);
          }
          else{ 
            res.render('pollvoteresult', {
              title: 'Poll voting info',
              message: req.flash('message'),
              poll: savedPoll,
              currentUser: req.user
            });
          }

        });
      }

    }
  })
};