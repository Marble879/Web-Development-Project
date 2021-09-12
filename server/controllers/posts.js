/** NOTE: Image handling was referenced from the following links: 
 * https://www.youtube.com/watch?v=srPXMt1Q0nY
 * https://github.com/expressjs/multer#error-handling
*/

var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var multer = require('multer');
var fs = require('fs');

// Allows us to define how files are stored.
var storage = multer.diskStorage({
    destination: function(req, file, cb){ // function defines where incoming image should be stored.
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    } 
});

var imageFilter = function(req, image, cb) {
    if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
        //accepts image
        cb(null, true); 
    } else {
        //rejects image
        cb(new Error('ERROR: Image file type is not supported'), false); // Error message added here due to this being the fail/rejected case
    }
};

var imgUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 80 // accepts file sizes up to 80mb
    }
});

router.use(express.json());

router.post('/api/posts', imgUpload.single('image'), function (req, res, next) {
    console.log(req.file);
    var post = new Post(req.body);
    post.image = req.file.path;
    post.save(function (err, post) {
        if (err) { next(err) }
        console.log('post created');
        res.status(201).json(post); 
    });
});

router.get('/api/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }
        console.log('post retreived');
        res.status(200).json({ "posts": posts });
    });
});

router.get('/api/posts/:id', function(req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, posts) {
        if (err) { return next(err); }
        if (posts.length == 0) { return res.status(404).json({ message: "Post not found"}); }
        console.log('Post with specified id retreived');
        res.status(200).json(post);
    });
});

router.get('/api/posts/tag/:tag', function(req, res, next) {
    var tag = req.params.tag;
    Post.find({ tags: { $all: tag } }, function (err, posts) {
        if (err) { return next(err); }
        if (posts.length == 0) { return res.status(404).json({ message: "No post with tag: " + tag + "found"}); }
        console.log('Post with specified tag retreived');
        res.status(200).json({ "posts": posts });
    });
});

router.put('/api/posts/:id', function(req, res, next) {
    var id = req.params.id;
    Post.findById(id, function(err, post) {
        if (err) { return next(err); }
        if (post == null) { return res.status(404).json({ message: "Post not found"}); }
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



router.patch('/api/posts/:id', function (req, res, next) {
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
    Post.findOneAndDelete({ _id: id}, function(err, post) {
        if (err) { return next(err); } 
        if (post == null) { return res.status(404).json({ message: "Post not found" }); }
        fs.unlink(post.image, function (err) {
            if (err) { return next(err); }
        });
        res.status(200).json(post);
        console.log('post deleted');
    });
});

//DELETE ALL POSTS FOR TESTING PURPOSES
router.delete('/api/posts', function(req, res, next) { 
    Post.deleteMany({}, function(err, deleteInformation) { 
        if (err) { return next(err); }
        res.status(200).json(deleteInformation);
        console.log('All posts deleted');
    });
});

  

module.exports = router;

