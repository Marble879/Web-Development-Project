//NOTE: Image handling was referenced from the following link: https://www.youtube.com/watch?v=srPXMt1Q0nY

var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var multer = require('multer');

// Allows us to define how files are stored.
var storage = multer.diskStorage({
    destination: function(req, image, next){ // function defines where incoming image should be stored.
        next(null, './uploads/');
    },
    filename: function(req, image, next) {
        next(null, image.originalname);
    } 
});

var imageFilter = function(req, image, next) {
    if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
        //accepts image
        next(null, true); // where null is, error message etc can be added!
    } else {
        //rejects image
        next(null, false);
    }
};

var imgUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 80 // accepts file sizes up to 80mb
    }
}); // {dest: '/uploads/'} will specify a destination folder where multer will   store incoming files.

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
router.delete('/api/posts', function(req, res, next) { 
    Post.deleteMany({}, function(err, deleteInformation) { 
        if (err) { return next(err); }
        res.status(200).json(deleteInformation);
        console.log('All posts deleted');
    });
});

  

module.exports = router;

