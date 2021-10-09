var express = require('express');
var router = express.Router();
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var Collection = require('../models/collection');
var User = require('../models/user')

router.use(express.json());

router.post('/api/users/:userID/collections', imgUpload.none(), function (req, res, next) {
    var collection = new Collection(req.body);
    User.findById(req.params.userID, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user === null) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        collection.save(function (err, collection) {
            if (err) {
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
    User.findById(req.params.userID, function (err, user) {
        if (err) {
            return next(err);
        }
    }).populate('collections').exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user == null) {
            var err = new Error('No user collection found');
            err.status = 404;
            return next(err);
        }
        console.log(`User collections retrieved`);
        res.status(200).json(user);
    });
});

router.get("/api/users/:userID/collections/:collectionID", function (req, res, next) {
    User.findOne({ _id: req.params.userID }, { "collections": req.params.collectionID })
        .populate("collections").exec(function (err, user) {
            if (err) {
                return next(err);
            }
            if (user == null) {
                var err = new Error('No user found with specific collection');
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
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": " collection not found" });
        }
        collection.title = req.body.title;
        collection.event = req.body.event;
        collection.thumbnail = req.file.path;
        collection.save();
        res.status(200).json(collection);
        console.log("collection saved");
    });
});

router.patch("/api/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": "user not found" });
        }
        collection.title = (req.body.title || collection.title);
        var postId = (req.body.post_id || null);
        if (postId != null) {
            collection.post_id.push(postId);
        }
        collection.save();
        res.status(200).json(collection);
        console.log("collection updated");
    });
});

router.delete("/api/collections/:id", async function (req, res, next) {
    var id = req.params.id;
    Collection.findOneAndDelete({ _id: id }, async function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": "collection not found" });
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