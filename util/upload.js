const multer = require('multer')
const upload_mutter = require('./upload-middleware')
const upload = multer({storage: upload_mutter.files.storage()})

module.exports = upload