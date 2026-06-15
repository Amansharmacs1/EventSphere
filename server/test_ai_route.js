const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

async function testAI() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: 'admin' });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  try {
    const response = await fetch('http://localhost:5001/api/events/ai-description', {
      method: 'POST',
      body: JSON.stringify({
        title: "Test Event",
        category: "Technology",
        speaker: "Aman Sharma"
      }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`
      }
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAI();
