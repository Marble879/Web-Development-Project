var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Rating = require('../models/rating');
var User = require('../models/user')
var mongoose = require('mongoose');

router.use(express.json());

router.post('/api/posts/:id/ratings', function (req, res, next) {
    var postId = req.params.id;
    var userId = req.body.user;
    var rating = new Rating(req.body);
    User.findById(userId, function(err, user){
        if (err) { return next(err) }
        if (user === null) { return res.status(404).json({ message: "User not found" }); }        
        Post.findById(postId, function(err, post){
            if (err) { return next(err) }
            if (post === null) { return res.status(404).json({ message: "Post not found" }); }
            rating.post = postId;
            rating.save(function (err, rating) {
                if (err) { return next(err) }
                post.ratings.push(rating._id);
                post.save();
                console.log('Rating created');
                return res.status(201).json(rating); 
            });
        })
    })
});

router.patch('/api/ratings/:id', function (req, res, next) {
    var id = req.params.id;
    Rating.findById(id, function (err, rating) {
        if (err) { return next(err); }
        if (rating == null) { return res.status(404).json({ message: "Rating not found"}); }
        // It makes sense to patch only the score, rather than which post or user the rating belongs to
        rating.starRating = (req.body.starRating || rating.starRating);
        rating.save();
        console.log('Rating saved');
        return res.status(200).json(rating);
    });
});

router.get('/api/ratings', function (req, res, next) {
    Rating.find(function (err, ratings) {
        if (err) { return next(err); }
        if (ratings.length == 0) { return res.status(404).json({ message: "Ratings not found"}); }
        console.log('Ratings retreived');
        return res.status(200).json(ratings);
    })
    .populate('user')
    .populate('post');
});

router.delete('/api/posts/:postId/ratings/:ratingId', function (req, res, next) {
    var postId = req.params.postId;
    var ratingId = req.params.ratingId;
    Post.findById(postId, function(err, post){
        if (err) { return next(err) }
        if (post === null) { return res.status(404).json({ message: "Post not found" }); }
        Rating.findOneAndDelete({ _id: ratingId}, async function(err, rating) {
            if (err) { return next(err); } 
            if (rating == null) { return res.status(404).json({ message: "Rating not found" }); }
            try {
                await Post.updateOne({_id: post._id}, { $pullAll: {ratings: [rating._id] }} );
                res.status(200).json(rating);
                console.log('Specific rating deleted');
            } catch (err) {
                next(err);
            }
        });
    })
});

module.exports = router;
