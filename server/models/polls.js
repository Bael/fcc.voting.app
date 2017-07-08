var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the schema for User model
var pollSchema = mongoose.Schema({
    name: String,
    createdOn: Date,
    authorId: Schema.Types.ObjectId,
    options: [
      {
        name: String,
        votes: Number
      }
    ],
    votes: [
      {
        voterId: Schema.Types.ObjectId,
        voterIP: String
      }
    ]
});

// assign a function to the "methods" object of our pollSchema
pollSchema.methods.hasOption = function(name) {
  for (var i=0; i < this.options.length; i++) {
    if(this.options[i].name === name)
    {
      return true;
    }
  }

  return false;
 
};

pollSchema.methods.vote = function(name, userInfo) {
  for (var i=0; i < this.options.length; i++) {
    if(this.options[i].name === name)
    {
      console.log("founded vote!");
      this.options[i].votes ++;
    }
  }

  this.votes.push({voterId:userInfo.userId, voterIP:userInfo.ip});


}


module.exports = mongoose.model('Poll', pollSchema);
