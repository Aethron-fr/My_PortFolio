import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    // There is no listModels in the standard SDK directly exposed in a simple way for free keys.
    // Let's just try to hit the REST endpoint directly.
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.VITE_GEMINI_API_KEY}`);
    const data = await res.json();
    console.log("AVAILABLE MODELS:", data.models?.map(m => m.name).join(", ") || data);
  } catch(e) {
    console.error(e);
  }
}
check();
