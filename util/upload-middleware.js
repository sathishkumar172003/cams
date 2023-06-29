const  multer = require('multer');
module.exports.files={
    storage:function(){
        var storage = multer.diskStorage({
        destination:  (req, file, cb) => {
          cb(null, 'public/uploaded-images/')
        },
        filename:  (req, file, cb) => {
            cb(null, new Date().toISOString() + "-" +file.originalname)
        }
      })
      
      return storage;
},
 fileFilter : (req, file, cb) =>{
    if(file.mimetype  === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
}