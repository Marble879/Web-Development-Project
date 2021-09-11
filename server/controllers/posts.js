var express = require('express');
var router = express.Router();
var Post = require('../models/post');

router.use(express.json());

router.post('/api/posts', function (req, res, next) {
    var post = new Post(req.body);
    post.save(function (err, post) {
        if (err) { next(err) }
        console.log('post created');
        res.status(201).json(post); 
    });
});

router.get('/api/posts', function (req, res, next) {
    Post.find(function (err, post) {
        if (err) {
            return next(err);
        }
        console.log('post retreived');
        res.status(200).json({ post: post });
    });
});

router.get('/api/posts/:id', function(req, res, next) {
    var id = req.params.id;
    Post.findById(req.params.id, function (err, post) {
        if (err) { return next(err); }
        if (user == null) { return res.status(404).json({ message: "Post not found"}); }
        console.log('Post with specified id retreived');
        res.status(200).json(post);
    });
});

router.put('/api/posts/:id', function(req, res, next) {
    var id = req.params.id;
    Post.findById(req.params.id, function(err, post) {
        if (err) { return next(err); }
        if (post == null) { return res.status(404).json({ message: "User not found"}); }
        post.title = req.body.title;
        post.description = req.body.description;
        post.numberOfFavorites = req.body.numberOfFavorites;
        post.tags = req.body.tags;
        post.image = req.body.image;
        post.save();
        res.status(200).json(post);
        console.log('post saved');
    });
});



router.patch('api/posts/:id', function (req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) { return next(err); }
        if (post == null) { return res.status(404).json({ message: "Post not found"}); }
        post.title = (req.body.title || post.title);
        post.description = (req.body.description || post.description);
        post.numberOfFavorites = (req.body.numberOfFavorites || post.numberOfFavorites);
        post.tags = (req.body.tags || post.tags);
        post.image = (req.body.image || post.image);
        post.save();
        res.status(200).json(post);
        console.log('post saved');
    });
});

router.delete('/api/posts/:id', function (req, res, next) {
    var id = req.params.id;
    Post.findOneAndDelte({ _id: id}, function(err, user) {
        if (err) { return next(err); } 
        if (post == null) { return res.status(404).json({ message: "Post not found" }); }       
        res.status(200).json(post);
        console.log('post deleted');
    });
});

//DELETE ALL POSTS FOR TESTING PURPOSES
router.delete('/api/posts', function(res, req, next) { 
    Post.deleteMany({}, function(err, deleteInformation) { 
        if (err) { return next(err); }
        res.status(200).json(deleteInformation);
        console.log('All posts deleted');
    });
});

  

module.exports = router;

