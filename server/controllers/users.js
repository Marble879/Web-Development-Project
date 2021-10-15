var express = require('express');
var router = express.Router();
var User = require('../models/user');
var imgUpload = require('../image_handling/imageUploadHandler');
var imgDelete = require('../image_handling/imageDeleteHandler');
var mongoose = require('mongoose');
var Collection = require('../models/collection');

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
      if (err.name == 'ValidationError') {
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
  User.findById(id, function (err, user) {
    if (err) {
      if (err instanceof mongoose.CastError) {
        err.status = 400;
        err.message = 'Invalid user ID';
      }
      return next(err);
    }
    if (user == null) {
      var err = new Error(`No user found`);
      err.status = 404;
      return next(err);
    }
    console.log('user with specified id retreived');
    res.status(200).json(user);
  });
});

router.put("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) {
      if (err instanceof mongoose.CastError) {
        err.status = 400;
        err.message = 'Invalid user ID';
      }
      return next(err);
    }
    if (user == null) {
      var err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    user.username = req.body.username;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.event = req.body.event
    user.collections = req.body.collections;
    user.save(async function (err, user) {
      if (err) {
        if (err.name == 'ValidationError') {
          err.message = 'ValidationError. Incorrect data input.';
          err.status = 422;
        } else if (err.code === 11000) {
          err.status = 409;
          err.message = 'Username already exists!'
        }
        return next(err);
      }
      if (user.collections == req.body.collections && !(!(user.collections))) {
        var error = null;
        for (var i = 0; i < user.collections.length; i++) {
          await Collection.findById(user.collections[i], async function (err, collection) {
            if (collection == null) {
              error = new Error('Collection not found!');
              error.status = 404;
            }
          });
        }
        if (error != null) {
          return next(error)
        }
      }
      res.status(200).json(user);
      console.log('user saved');
    });
  });
});

router.patch("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) {
      if (err instanceof mongoose.CastError) {
        err.status = 400;
        err.message = 'Invalid user ID';
      }
      return next(err);
    }
    if (user == null) {
      var err = new Error('User not found');
      err.status = 404;
      return next(err)
    }
    user.username = (req.body.username || user.username);
    user.password = (req.body.password || user.password);
    user.bio = (req.body.bio || user.bio);
    var collectionID = (req.body.collections || null);
    if (collectionID != null) {
      try {
        user.collections.push(collectionID);
      } catch (err) {
        if (err instanceof mongoose.CastError) {
          err.status = 422;
          err.message = 'ValidationError. Incorrect data input.';
          return next(err);
        }
      }
    }
    user.save(async function (err, user) {
      if (err) {
        if (err.name == 'ValidationError') {
          err.message = 'ValidationError. Incorrect data input.';
          err.status = 422;
        } else if (err.code === 11000) {
          err.status = 409;
          err.message = 'Username already exists!'
        }
        return next(err);
      }
      if ((collectionID != null)) {
        var error = null;
        await Collection.findById(collectionID, async function (err, collection) {
          if (collection == null) {
            error = new Error('Collection not found!');
            error.status = 404;
          }
        });
        if (error != null) {
          return next(error)
        }
      }
      res.status(200).json(user);
      console.log('user updated');
    });
  });
});

router.delete("/api/users/:id", async function (req, res, next) {
  var id = req.params.id;
  User.findOneAndDelete({ _id: id }, async function (err, user) {
    if (err) {
      if (err instanceof mongoose.CastError) {
        err.status = 400;
        err.message = 'Invalid post ID';
      }
      return next(err);
    }
    if (user == null) {
      var err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    try {
      await imgDelete.deleteSingleImage(user.icon);
      user.remove();
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
    if (deleteInformation.n == 0) {
      var err = new Error('No users were found');
      err.status = 404;
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