var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
  body: String,
  author: String,
  upvotes: {
      type: Number, 
      default: 0
  },
  post: { 
      type: Schema.Types.ObjectId, 
      ref: 'Post' }
});

Comment.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

module.exports = mongoose.model('Comment', Comment);