const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {

            cb(null, './public/uploads/images/');

        } else if (file.mimetype.startsWith('video/')) {

            cb(null, './public/uploads/videos/');
        }
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const filefilter = (req, file, cb) => {

    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                'only images and videos are allowed'
            )
        );
    }
};

const upload = multer({

    storage,

    limits: {
        fileSize: 20 * 1024 * 1024
    },

    fileFilter: filefilter
});

module.exports = upload;