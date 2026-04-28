'use strict';
/**
 * config/cloudinary.js – Cloudinary SDK configuration
 * Free tier: https://cloudinary.com/ (sign up → Dashboard → API Keys)
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
  secure     : true,
});

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer   – file buffer from multer memoryStorage
 * @param {string} folder   – destination folder (e.g. 'hometrust/listings')
 * @param {string} [publicId] – optional public_id override
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadBuffer = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const opts = { folder, resource_type: 'auto' };
    if (publicId) opts.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(opts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public_id.
 */
const deleteAsset = (publicId, resourceType = 'image') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

module.exports = { cloudinary, uploadBuffer, deleteAsset };
