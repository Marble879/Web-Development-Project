/** NOTE: Image handling was referenced from the following links: 
 * https://www.youtube.com/watch?v=srPXMt1Q0nY
 * https://github.com/expressjs/multer#error-handling
 * https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js/49125621
 * https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
 * https://www.tabnine.com/code/javascript/functions/fs%2Fpromises/unlink
 * https://stackoverflow.com/questions/48842006/to-use-multer-to-save-files-in-different-folders
*/

var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Rating = require('../models/rating');
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var mongoose = require('mongoose');
var multer = require('multer');


router.use(express.json());

function queryByTag(tag, req, res, next) {
    Post.find({ tags: { $all: tag } }, function (err, posts) {
        if (err) { return next(err); }
    }).populate('user_id').exec(function (err, posts) {
        if (err) { return next(err); }
        if (posts.length == 0) { 
            var err = new Error('No post with tag: ' + tag + ' found');
            err.status = 404;
            return next(err);
        }
        console.log('Posts with specified tag retreived');
        res.status(200).json({ "posts": posts });
    });;
}

router.post('/api/posts', imgUpload.single('image') ,function (req, res, next) {
    //NOTE: When creating a post, the event variable has to be passed before the image!
    var post = new Post(req.body);
    post.post_id = mongoose.Types.ObjectId();
    try {
        post.image = req.file.path;
    } catch (err){
        if (err instanceof TypeError){
            err.status = 422;
            err.message = 'Input error, Image was not found';
            return next(err);
        } 
    }
    // This check is necessary to ensure that there is a user_id when creating a post, since a post
    // needs a user when creating it. If the user is deleted, the post will still remain (hence the manual check).
    if (!req.body.user_id){
        var err = new Error('ValidationError: Missing user_id when creating a post');
        err.status = 422;
        return next(err);
    }
    post.save(function (err, post) {
        if (err) {
            if ( err.name == 'ValidationError' ) {
                err.message = 'ValidationError. Incorrect data input.';
                err.status = 422;
            } 
            return next(err); 
        }
        res.status(201).json(post);
    });
});

router.get('/api/posts', function (req, res, next) {
    if (req.query.tag != null) {
        var tag = req.query.tag;
        queryByTag(tag, req, res, next);
    } else {
        Post.find(function (err, posts) {
            if (err) { return next(err); }
        }).populate('user_id').exec(function (err, posts) {
            if (err) { return next(err); }
            if (posts.length == 0) { 
                var err = new Error('No posts found');
                err.status = 404;
                return next(err);
            }
            console.log('posts retreived');
            res.status(200).json({ "posts": posts });
        });
    }
});

router.get('/api/posts/:id', function (req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) { return next(err); }
    }).populate('user_id').exec(function (err, post) {
        if (err) { 
            if (err instanceof mongoose.CastError){
                err.status = 400;
                err.message = 'Invalid post ID';
            }
            return next(err); 
        }
        if (post == null) { 
            var err = new Error('No Post found');
            err.status = 404;
            return next(err); 
        } 
        console.log('Post with specified id retreived');
        res.status(200).json(post);
    });
});

router.put('/api/posts/:id', function (req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) { 
            if (err instanceof mongoose.CastError){
                err.status = 400;
                err.message = 'Invalid post ID';
            }
            return next(err);
        }
        if (post == null) {
            var err = new Error('Post not found');
            err.status = 404;
            return next(err)
        }
        post.title = req.body.title;
        post.description = req.body.description;
        post.numberOfFavorites = req.body.numberOfFavorites;
        post.tags = req.body.tags;
        post.save(function(err, post) {
            if (err) {
                if ( err.name == 'ValidationError' ) {
                    err.message = 'ValidationError. Incorrect data input.';
                    err.status = 422;
                } 
                return next(err); 
            }
            res.status(200).json(post);
            console.log('post saved');
        });
    });
});

router.patch('/api/posts/:id', function (req, res, next) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) { 
            if (err instanceof mongoose.CastError){
                err.status = 400;
                err.message = 'Invalid post ID';
            }
            return next(err); 
        }
        if (post == null) { 
            var err = new Error('Post not found');
            err.status = 404;
            return next(err)
        }
        post.title = (req.body.title || post.title);
        post.description = (req.body.description || post.description);
        post.numberOfFavorites = (req.body.numberOfFavorites || post.numberOfFavorites);
        post.tags = (req.body.tags || post.tags);
        post.save( function (err, post) {
            if (err) {
                if ( err.name == 'ValidationError' ) {
                    err.message = 'ValidationError. Incorrect data input.';
                    err.status = 422;
                } 
                return next(err); 
            }
            res.status(200).json(post);
            console.log('post saved');
        });
    });
});

router.delete('/api/posts/:id', async function (req, res, next) {
    var id = req.params.id;
    Post.findOneAndDelete({ _id: id }, async function (err, post) {
        if (err) {
            if (err instanceof mongoose.CastError){
                err.status = 400;
                err.message = 'Invalid post ID';
            }
            return next(err);
        }
        if (post == null) { 
            var err = new Error('Post not found');
            err.status = 404;
            return next(err); 
        } 
        try {
            await imgDelete.deleteSingleImage(post.image);
            post.remove();
            res.status(200).json(post);
            console.log('specific post deleted');
        } catch (err) {
            next(err);
        }
    });
});

//DELETE ALL POSTS FOR TESTING PURPOSES
router.delete('/api/posts', async function (req, res, next) {
    Post.deleteMany({}, async function (err, deleteInformation) {
        if (err) { return next(err); }
        if (deleteInformation.n == 0) { 
            var err = new Error('No posts were found');
            err.status = 404;
            return next(err); 
        } 
        try {
            await imgDelete.deleteAllImages('./uploads/');
            await Rating.deleteMany();
            res.status(200).json(deleteInformation);
            console.log('All posts deleted');
        } catch (err) {
            next(err);
        }
    });
});

module.exports = router;

