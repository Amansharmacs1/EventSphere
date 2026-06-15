const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  try {
    const result = await cloudinary.api.ping();
    console.log(`Success:`, result.status);
  } catch (err) {
    console.log(`Error full:`, err);
  }
}

run();
