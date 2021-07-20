const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const streamifier = require("streamifier");

const {
  CLOUDINARY_HOST,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  UPLOAD_NAME,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_HOST,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "user",
        upload_preset: UPLOAD_NAME,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadImage;
