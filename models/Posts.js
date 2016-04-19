var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
  title: String,
  link: String,
  author: String,
  upvotes: {
      type: Number, 
      default: 0
  },
  comments: [{ 
      type: Schema.Types.ObjectId,
      ref: 'Comment' 
  }]
});

Post.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

module.exports = mongoose.model('Post', Post);