var express = require('express');
var router = express.Router();
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var Collection = require('../models/collection');
var User = require('../models/user')

router.use(express.json());

router.post('/api/collections', imgUpload.none(), function (req, res, next) {
    var collection = new Collection(req.body);
    collection.save(function (err, collection) {
        if (err) {
            return next(err);
        }
        console.log('collection created');
        res.status(201).json(collection);
    });
});

router.get("/api/users/:userID/collections", function (req, res, next) {
    Collection.find(function (err, collection) {
        if (err) {
            return next(err);
        }
        console.log('collections retreived');
    }).populate('post_id').exec(function (err, collection) {
        if (err) {
            return next(err);
        }
        console.log(`collection posts`);
        res.status(200).json({ "collections": collection });
    });
});

router.get("/api/users/:userID/collections/:collectionID", function (req, res, next) {
    var userID = req.params.userID;
    var collectionID = req.params.collectionID;
    User.findById(userID, function (err, user) {
        if (err) { return next(err) }
        if (user === null) {
            return res.status(404).json({ message: "User not found" });
        }
        Collection.findById(collectionID, function (err, collection) {
            if (err) {
                return next(err);
            }
            if (collection == null) {
                return res.status(404).json({ "message": "collection not found" });
            }
            console.log('collection with specified id retreived');
            res.status(200).json(collection);
        });
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
        var postId = (req.body.post_id || collection.post_id)
        collection.post_id.push(postId)
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