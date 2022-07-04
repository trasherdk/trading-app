// importing all required liberary and nodejs modules
const path = require("path");
const multer = require("multer");

// diskStorage for directing file to uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, callback) {
    const uniquePrefix = Date.now() + Math.random().toString();
    callback(null, `${uniquePrefix}-${file.originalname}`);
  },
});

// uploads file to upload folder
const upload = multer({
  storage,
});

// uploading a single file
const uploadSingle = (fileKey) => {
  return function (req, res, next) {
    const uploadItem = upload.single(fileKey);
    uploadItem(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).send(err.message);
      } else if (err) {
        return res.status(500).send(err.message);
      }
      // Everything went fine.
      next();
    });
  };
};

// exporting upload and single uplaod functions
module.exports = { upload, uploadSingle };
