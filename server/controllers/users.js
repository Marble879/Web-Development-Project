var express = require('express');
var router = express.Router();
var User = require('../models/user');
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');

router.use(express.json());

router.post("/api/users", imgUpload.single('icon'), function (req, res, next) {
  //NOTE: When creating a user, the event variable has to be passed before the image!
  var user = new User(req.body);
  user.icon = req.file.path;
  user.save(function (err, user) {
    if (err) {
      return next(err);
    }
    console.log('user created');
    res.status(201).json(user);
  });
});

router.get("/api/users", function (req, res, next) {
  User.find(function (err, user) {
    if (err) {
      return next(err);
    }
    console.log('user retreived');
    res.status(200).json({ user: user });
  });
});

router.get("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log('user with specified id retreived');
    res.status(200).json(user);
  });
});

router.put("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = req.body.username;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.save();
    res.status(200).json(user);
    console.log('user saved');
  });
});

router.patch("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) { return next(err); }
    if (user == null) {
      return res.status(404).json({ "message": "User not found" });
    }
    user.username = (req.body.username || user.username);
    user.password = (req.body.password || user.password);
    user.bio = (req.body.bio || user.bio);
    user.save();
    res.status(200).json(user);
    console.log('user updated');
  });
});

router.delete("/api/users/:id", async function (req, res, next) {
  var id = req.params.id;
  User.findOneAndDelete({ _id: id }, async function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      await imgDelete.deleteSingleImage(user.icon);
      res.status(200).json(user);
      console.log('')
    } catch (err) {
      next(err);
    }
  });
});

// DELETE ALL USERS FOR TESTING PURPOSES
router.delete("/api/users", async function (req, res, next) {
  User.deleteMany({}, async function (err, deleteInformation) {
    if (err) {
      return next(err);
    }
    try {
      await imgDelete.deleteAllImages('./icons/')
      res.status(200).json(deleteInformation);
      console.log('all users deleted');
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;