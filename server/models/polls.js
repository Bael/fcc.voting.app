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


module.exports = mongoose.model('Poll', pollSchema);
