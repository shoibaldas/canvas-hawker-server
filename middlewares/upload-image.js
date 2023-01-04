 const multer = require("multer");

 const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.originalname.split(".")[0].replace(/\ /g, "") +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  });
  
  const checkImage = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: fileStorage,
    fileFilter: checkImage,
  });

module.exports = upload.single("image");