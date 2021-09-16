var multer = require('multer');
var path = require('path');
const imageDirectory = './uploads/';
const iconImageDirectory = './icons/';

// Allows us to define how files are stored.
var storage = multer.diskStorage({
    destination: function(req, file, cb) { // function defines where incoming image should be stored.
        if (req.body.event == 'icon') { 
            cb(null, iconImageDirectory)
        } else {
            cb(null, imageDirectory);
        };
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    } 
});

var imageFilter = function(req, image, cb) {
    if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png' || image.mimetype === 'image/jpg') {
        //accepts image
        cb(null, true); 
    } else {
        //rejects image
        cb(new Error('ERROR: Image file type is not supported'), false); // Error message added here due to this being the fail/rejected case
    }
};

var imgUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 80 // accepts file sizes up to 80mb
    }
});

module.exports = imgUpload;
