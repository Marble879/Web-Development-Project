var express = require('express');
var router = express.Router();
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var Collection = require('../models/collection');
var User = require('../models/user')
var mongoose = require('mongoose');

router.use(express.json());

router.post('/api/users/:userID/collections', imgUpload.none(), function (req, res, next) {
    var userID = req.params.userID;
    var collection = new Collection(req.body);
    User.findById(userID, function (err, user) {
        if (err) {
            if (err instanceof mongoose.CastError) {
                err.status = 400;
                err.message = 'Invalid user ID';
            }
            return next(err);
        }
        if (user == null) {
            var err = new Error('No User found');
            err.status = 404;
            return next(err);
        }
        collection.save(function (err, collection) {
            if (err) {
                if (err.name == 'ValidationError') {
                    err.message = 'ValidationError. Incorrect data input.';
                    err.status = 422;
                }
                return next(err);
            }
            user.collections.push(collection._id);
            user.save();
            console.log('Collection created');
            return res.status(201).json(collection);
        })
    })
});

router.get("/api/users/:userID/collections", function (req, res, next) {
    var userID = req.params.userID;
    User.findById(userID, function (err, user) {
        if (err) {
            return next(err);
        }
    }).populate('collections').exec(function (err, user) {
        if (err) {
            if (err instanceof mongoose.CastError) {
                err.status = 400;
                err.message = 'Invalid user ID';
            }
            return next(err);
        }
        if (user == null) {
            var err = new Error('No User found');
            err.status = 404;
            return next(err);
        }
        if (user.collections.length == 0) {
            var err = new Error('No user collections found');
            err.status = 404;
            return next(err);
        }
        console.log(`User collections retrieved`);
        res.status(200).json(user);
    });
});

router.get("/api/users/:userID/collections/:collectionID", function (req, res, next) {
    var userID = req.params.userID;
    var collectionID = req.params.collectionID;
    User.findOne({ _id: userID }, { "collections": collectionID })
        .populate("collections").exec(function (err, user) {
            if (err) {
                if (err instanceof mongoose.CastError) {
                    err.status = 400;
                    err.message = 'Invalid user ID or collection ID';
                }
                return next(err);
            }
            if (user == null) {
                var err = new Error('No User found');
                err.status = 404;
                return next(err);
            }
            console.log('User specific collection retreived');
            res.status(200).json(user);
        });
});

router.put("/api/collections/:id", imgUpload.single('thumbnail'), function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            if (err instanceof mongoose.CastError) {
                err.status = 400;
                err.message = 'Invalid collection ID';
            }
            return next(err);
        }
        if (collection == null) {
            var err = new Error('No collection found');
            err.status = 404;
            return next(err);
        }
        collection.title = req.body.title;
        collection.event = req.body.event;
        try {
            collection.thumbnail = req.file.path;
        } catch (err) {
            if (err instanceof TypeError) {
                err.status = 422;
                err.message = 'Input error, Thumbnail was not found';
                return next(err);
            }
        }
        collection.save(function (err, collection) {
            if (err) {
                if (err.name == 'ValidationError') {
                    err.message = 'ValidationError. Incorrect data input.';
                    err.status = 422;
                }
                return next(err);
            }
            res.status(200).json(collection);
            console.log("collection saved");
        });
    });
});

router.patch("/api/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            if (err instanceof mongoose.CastError) {
                err.status = 400;
                err.message = 'Invalid collection ID';
            }
            return next(err);
        }
        if (collection == null) {
            var err = new Error('No collection found');
            err.status = 404;
            return next(err);
        }
        collection.title = (req.body.title || collection.title);
        var postId = (req.body.post_id || null)
        if (postId != null) {
            collection.post_id.push(postId)
        }
        collection.save(function (err, collection) {
            if (err) {
                if (err.name == 'ValidationError') {
                    err.message = 'ValidationError. Incorrect data input.';
                    err.status = 422;
                }
                return next(err);
            }
            res.status(200).json(collection);
            console.log("collection updated");
        });
    });
});

router.delete("/api/collections/:id", async function (req, res, next) {
    var id = req.params.id;
    Collection.findOneAndDelete({ _id: id }, async function (err, collection) {
        if (err) {
            if (err instanceof mongoose.CastError) {
                err.status = 400;
                err.message = 'Invalid collection ID';
            }
            return next(err);
        }
        if (collection == null) {
            var err = new Error('No collection found');
            err.status = 404;
            return next(err);
        }
        try {
            collection.remove();
            await imgDelete.deleteSingleImage(collection.thumbnail);
            res.status(200).json(collection);
            console.log('specific collection deleted');
        } catch (err) {
            next(err);
        }
    });
});

//DELETE ALL COLLECTIONS FOR TESTING PURPOSES
router.delete("/api/collections", async function (req, res, next) {
    Collection.deleteMany({}, async function (err, deleteInformation) {
        if (err) {
            return next(err);
        }
        if (deleteInformation.n == 0) {
            var err = new Error('No collections were found');
            err.status = 404;
            return next(err);
        }
        try {
            await imgDelete.deleteAllImages('./thumbnails/');
            res.status(200).json(deleteInformation);
            console.log('all collections deleted');
        } catch (err) {
            next(err);
        }
    });
});

module.exports = router;