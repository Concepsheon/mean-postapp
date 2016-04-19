var express = require('express');
var router = express.Router();

var Post = require('../models/Posts');
var Comment = require('../models/Comments');
var User = require("../models/User");
var passport = require("passport");
var jwt = require("express-jwt");

var Strategy = require("passport-local").Strategy;

var config = require("../config");
//userProperty specifies which property on req to store payload from token
var auth = jwt({secret: config.secret, userProperty: 'payload'});

router.use(passport.initialize());

passport.use(new Strategy(User.authenticate()));


//gets all posts
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

//creates new post
router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

//preloads post by id and sets it to req.post
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});


router.get('/posts/:post', function(req, res,next) {
   req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth,function(req,res,next){
    req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});


router.use(function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({
      message:'Username and Password required'
    });
  }
  next();
});

router.post('/register', function(req,res,next){
  var user = new User();
  
  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()});
  });
  
  /*User.register(new User({username: req.body.username}), req.body.password, function(err){
    if(err){
      return console.log("can't register user", err);
    }
    res.json({
      success: true,
      token : User.generateJWT()
    });
  });*/
  
});


router.post('/login', function(req, res, next){

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


/*router.post('/login', passport.authenticate('local'), function(req,res){
  res.json({
    success: true,
    user: req.user
  });
});
*/



module.exports = router;
