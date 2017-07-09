const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// define the schema for User model
const pollSchema = mongoose.Schema({
  name: String,
  createdOn: Date,
  authorId: Schema.Types.ObjectId,
  options: [
    {
      name: String,
      votes: Number,
    },
  ],
  votes: [
    {
      voterId: Schema.Types.ObjectId,
      voterIP: String,
    },
  ],
});

// assign a function to the "methods" object of our pollSchema
pollSchema.methods.hasOption = function (name) {
  for (let i = 0; i < this.options.length; i++) {
    if (this.options[i].name === name)    {
      return true;
    }
  }

  return false;
};

pollSchema.methods.vote = function (name, userInfo) {
  for (let i = 0; i < this.options.length; i += 1) {
    if (this.options[i].name === name)    {
      console.log('founded vote!');
      this.options[i].votes += 1;
    }
  }
  this.votes.push({ voterId: userInfo.userId, voterIP: userInfo.ip });
};

function userHasVoted(userInfo) {
  for (let i = 0; i < this.votes.length; i += 1) {
    if (userInfo.userId) {
      console.log(`this.votes[i].voterId : ${this.votes[i].voterId}, userInfo.userId : ${userInfo.userId}`);
      if (this.votes[i].voterId.equals(userInfo.userId)) {
        console.log("You Already voted!");
        return true;
      }
    } else if (this.votes[i].voterIP === userInfo.ip) {
      return true;
    }
  }
  return false;
}

pollSchema.methods.userHasVoted = userHasVoted;


module.exports = mongoose.model('Poll', pollSchema);
