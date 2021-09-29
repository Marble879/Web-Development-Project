var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';

//Register a user
router.post('/api/users/register', (req, res) => {
    var username = req.body.username;
    var bio = req.body.bio;
    var password = req.body.password;
    var newUser = new User({
        username,
        bio,
        password,
    });
    User.createUser(newUser, (error, user) => {
        if (error) {
            res.status(422).json({
                message: 'Something went wrong. Please try again after some time!',
            });
        }
        res.status(201).json(user);
    });
});

//User login
router.post('/api/users/login', (req, res) => {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
        User.getUserByUsername(username, (err, user) => {
            if (!user) {
                res.status(404).json({ message: 'The user does not exist!' });
            } else {
                User.comparePassword(password, user.password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        var payload = { id: user.id };
                        var token = jwt.sign(payload, jwtOptions.secretOrKey);
                        res.json({ message: 'ok', token });
                    } else {
                        res.status(401).json({ message: 'The password is incorrect!' });
                    }
                });
            }
        });
    }
});

module.exports = router;