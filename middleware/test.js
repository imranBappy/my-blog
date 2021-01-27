const multer = require('multer')
const resizeOptimizeImages = require('resize-optimize-images');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {

        cb(null, file.fieldname + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {

        cb(null, true)


    }
})
module.exports = upload