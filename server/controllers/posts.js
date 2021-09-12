/** NOTE: Image handling was referenced from the following links: 
 * https://www.youtube.com/watch?v=srPXMt1Q0nY
 * https://github.com/expressjs/multer#error-handling
 * https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js/49125621
 * https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
 * https://www.tabnine.com/code/javascript/functions/fs%2Fpromises/unlink
*/

var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var fs = require('fs');
var path = require('path');
const imageDirectory = './uploads/';


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
        if (err) { return next(err); }
        if (posts.length == 0) { return res.status(404).json({ message: "Post not found"}); }
        console.log('post retreived');
        res.status(200).json({ "posts": posts });
    });
});

router.get('/api/posts/:id', function(req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) { return next(err); }
        if (post == 0) { return res.status(404).json({ message: "Post not found"}); }
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

router.delete('/api/posts/:id', async function (req, res, next) {
    var id = req.params.id;
    Post.findOneAndDelete({ _id: id}, async function(err, post) {
        if (err) { return next(err); } 
        if (post == null) { return res.status(404).json({ message: "Post not found" }); }
        try {
            await imgDelete.deleteSingleImage(post);
            res.status(200).json(post);
            console.log('specific post deleted');
        } catch (err) {
            next(err);
        }
    });
});

//DELETE ALL POSTS FOR TESTING PURPOSES
router.delete('/api/posts', async function(req, res, next) { 
    Post.deleteMany({}, async function(err, deleteInformation) { 
        if (err) { return next(err); }
        try {
            await imgDelete.deleteAllImages('./uploads/');
            res.status(200).json(deleteInformation);
            console.log('All posts deleted');
        } catch (err) {
            next(err);
        }
    });
});

module.exports = router;

