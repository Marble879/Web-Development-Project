var express = require('express');
var router = express.Router();
var Collection = require('../models/collection');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/api/users/:id/collections', function (req, res, next) {
    var collection = new Collection(req.body);
    collection.save(function (err, collection) {
        if (err) {
            return next(err);
        }
        console.log('Collection created');
        res.status(201).json(collection);
    });
});

router.get("/api/users/:id/collections", function (req, res, next) {
    Collection.find(function (err, collection) {
        if (err) {
            return next(err);
        }
        console.log('Collection retreived');
        res.json({ collection: collection });
    });
});

router.get("/api/users/:id/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": "Collection not found" });
        }
        console.log('Collection with specified id retreived');
        res.json(collection);
    });
});

router.put("/api/users/:id/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": " Collection not found" });
        }
        collection.title = req.body.title;
        collection.thumbnail = req.body.thumbnail;
        collection.save();
        res.json(collection);
        console.log("Collection saved");
    });
});

router.patch("/api/users/:id/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findById(id, function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": "User not found" });
        }
        collection.title = (req.body.title || collection.title);
        collection.thumbnail = (req.body.thumbnail || collection.thumbnail);
        collection.save();
        res.json(collection);
        console.log("Collection updated");
    });
});

router.delete("/api/users/:id/collections/:id", function (req, res, next) {
    var id = req.params.id;
    Collection.findOneAndDelete({ _id: id }, function (err, collection) {
        if (err) {
            return next(err);
        }
        if (collection == null) {
            return res.status(404).json({ "message": "Collection not found" });
        }
        res.json(collection);
        console.log("Collection deleted");
    });
});

//DELETE ALL COLLECTIONS FOR TESTING PURPOSES
router.delete("/api/users/:id/collections", function (req, res, next) {
    Collection.deleteMany({}, function (err, deleteInformation) {
        if (err) {
            return next(err);
        }
        res.json(deleteInformation);
        console.log("All collections deleted");
    });
});

module.exports = router;