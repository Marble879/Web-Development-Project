var express = require('express');
var User = require('../models/user');
var router = express.Router();
var imgUpload = require('../image_handling/imageUploadHandler');
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';

//Register a user
router.post('/api/usersAuth/register', imgUpload.single('icon'), (req, res, next) => {
    var username = req.body.username;
    var bio = req.body.bio;
    var password = req.body.password;
    var event = req.body.event;
    console.log(`here ${process.cwd()}`)
    try {
        var icon = req.file.path;
    } catch (err) {
        if (err instanceof TypeError) {
            err.status = 422;
            err.message = 'Input error, Icon was not found';
            return next(err);
        }
    }
    var collections = req.body.collections;
    var newUser = new User({
        username,
        bio,
        password,
        event,
        icon,
        collections
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
router.post('/api/usersAuth/login', (req, res) => {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
        User.getUserByUsername(username, (err, user) => {
            if (!user) {
                res.status(404).json({ message: 'The user does not exist!' });
            } else {
                User.comparePassword(password, user.password, (error, isMatch) => {
                    if (error) console.log(error);
                    if (isMatch) {
                        var payload = { id: user };
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

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

router.get('/api/usersAuth/data', checkToken, (req, res) => {
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, authorizedData) => {
        if (err) {
            console.log('ERROR: Could not connect to the protect route');
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to the protected route');
        }
    })
})

module.exports = router;