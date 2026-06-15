const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: './.env' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "Write a short 1 line description for an event.";

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.log("Error:", err);
  }
}

run();
