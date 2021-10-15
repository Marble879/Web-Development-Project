var multer = require('multer');
var path = require('path');
const postImageDirectory = '/uploads/';
const iconImageDirectory = '/icons/';
const thumbnailImageDirectory = '/thumbnails/';


// Allows us to define how files are stored.
var storage = multer.diskStorage({
    destination: function (req, file, cb) { // function defines where incoming image should be stored.
        if (req.body.event == 'post') {
            cb(null, path.join(__dirname, postImageDirectory));
        }
        else if (req.body.event == 'icon') {
            cb(null, path.join(__dirname, iconImageDirectory));
        }
        else if (req.body.event == 'thumbnail') {
            cb(null, path.join(__dirname, thumbnailImageDirectory));
        }
        else {
            var err = new Error('Invalid event');
            err.status = 422;
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var imageFilter = function (req, image, cb) {
    if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png' || image.mimetype === 'image/jpg') {
        //accepts image
        cb(null, true);
    } else {
        var err = new Error('ERROR: Image file type is not supported');
        err.status = 415;
        cb(err, false); // Error message added here due to this being the fail/rejected case
    }
};

var imgUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 25 // accepts file sizes up to 25mb
    }
}); 

module.exports = imgUpload;