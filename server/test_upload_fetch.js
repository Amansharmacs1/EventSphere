const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({ path: './.env' });

async function testUpload() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('No admin found');
    process.exit(1);
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const dummyImagePath = path.join(__dirname, 'dummy.png');
  fs.writeFileSync(dummyImagePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));

  const blob = new Blob([fs.readFileSync(dummyImagePath)], { type: 'image/png' });
  const form = new FormData();
  form.append('image', blob, 'dummy.png');

  try {
    const response = await fetch('http://localhost:5001/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        Cookie: `token=${token}`
      }
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    fs.unlinkSync(dummyImagePath);
    mongoose.connection.close();
  }
}

testUpload();
