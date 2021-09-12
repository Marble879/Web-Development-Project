var path = require('path');
var fs = require('fs');

var imageDeleteHandler = {
    deleteSingleImage: async function (post) {
        await fs.promises.unlink(post.image);
    },
    deleteAllImages: async function (imageDirectory) {
            const images = await fs.promises.readdir(imageDirectory);
            await Promise.all(images.map(image => fs.promises.unlink(path.join(imageDirectory, image))));
    }      
};


module.exports = imageDeleteHandler;
