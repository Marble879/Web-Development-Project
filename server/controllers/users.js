var express = require('express');
var router = express.Router();
var User = require('../models/user');
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var mongoose = require('mongoose')

router.use(express.json());

router.post("/api/users", imgUpload.single('icon'), function (req, res, next) {
  //NOTE: When creating a user, the event variable has to be passed before the image!
  var user = new User(req.body);
  try {
    user.icon = req.file.path;
  } catch (err) {
    if (err instanceof TypeError) {
      err.status = 422;
      err.message = 'Input error, Icon was not found';
      return next(err);
    }
  }
  user.save(function (err, user) {
    if (err) {
      if ( err.name == 'ValidationError') {
        err.message = 'ValidationError. Incorrect data input.';
        err.status = 422;
      } else if (err.code === 11000) {
        err.status = 409;
        err.message = 'Username already exists!'
      }
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
  }).populate('collections').exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (user.length == 0) {
      var err = new Error('No users found');
      err.status = 404;
      return next(err);
    }
    console.log(`User Collections`);
    res.status(200).json({ "users": user });
  });
});

router.get("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(req.params.id, function (err, user) {
    if (err) {
      if (err instanceof mongoose.CastError) {
        err.status = 400;
        err.message = 'Invalid user ID';
      }
      return next(err);
    }
    if (user == null) {
      var err = new Error(`No user with id: ${id} found`);
      err.status = 404;
      return next(err);
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
      return res.status(404).json({ "message": "User not found" });
    }
    user.username = req.body.username;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.collections = req.body.collections;
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
    user.collections = (req.body.collections || user.collections);
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
      return res.status(404).json({ "message": "User not found" });
    }
    try {
      user.remove();
      await imgDelete.deleteSingleImage(user.icon);
      res.status(200).json(user);
      console.log('User with specific ID removed');
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