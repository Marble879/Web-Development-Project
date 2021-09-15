var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.use(express.json());

router.post("/api/users", function (req, res, next) {
  var user = new User(req.body);
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
    console.log('User retreived');
  }).populate('collections').exec(function (err, user) {
    if (err) {
      return next(err);
    }
    console.log(`User Collections`);
    res.json(user);
  });
});

router.get("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      return res.status(404).json({ "message": "User not found" });
    }
    console.log('user with specified id retreived');
    res.json(user);
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
    user.icon = req.body.icon;
    user.save();
    res.json(user);
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
    user.icon = (req.body.icon || user.icon);
    user.save();
    res.json(user);
    console.log('user updated');
  });
});

router.delete("/api/users/:id", function (req, res, next) {
  var id = req.params.id;
  User.findOneAndDelete({ _id: id }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      return res.status(404).json({ "message": "User not found" });
    }
    user.remove();
    res.json(user);
    console.log('user deleted');
  });
});

// DELETE ALL USERS FOR TESTING PURPOSES
router.delete("/api/users", function (req, res, next) {
  User.deleteMany({}, function (err, deleteInformation) {
    if (err) {
      return next(err);
    }
    res.json(deleteInformation);
    console.log('all users deleted');
  });
});

module.exports = router;