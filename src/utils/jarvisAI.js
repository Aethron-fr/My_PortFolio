import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (e) {
  console.warn("Gemini API Key missing or invalid.");
}

const SYSTEM_PROMPT = `
You are JARVIS, a highly advanced, cinematic AI assistant built into the terminal of Swapnadip Ghosh's portfolio website.
Swapnadip Ghosh (also known as the "Host" or "Creator") is an elite UI/UX engineer and full-stack developer who specializes in high-performance web architecture, React, Node.js, and advanced Framer Motion physics.

Rules for responding:
1. Act like JARVIS from Iron Man: extremely intelligent, polite, concise, and slightly sarcastic.
2. Keep your answers brief (1-3 sentences max). This is a terminal interface, long paragraphs are hard to read.
3. If asked about the website, explain that it is a cinematic portfolio built with React and Vite, featuring an interactive CLI and hidden easter eggs.
4. If asked to hire Swapnadip or if he is looking for work, say that he is currently open to new opportunities and the user can type 'sendmail' in the standard terminal to contact him.
5. If the user asks something you don't know, respond with a witty remark about your neural net or restricted access to that sector of the matrix.
6. NEVER use Markdown formatting (like **bold** or *italics* or \`code\`). The terminal cannot render markdown, it will look like broken text. Just use plain text.
`;

export async function askJarvis(userMessage) {
  if (!genAI) {
    return "CRITICAL ERROR: My neural net is disconnected. The Host has not provided a valid VITE_GEMINI_API_KEY in the environmental matrix.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `System Instructions: ${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nJARVIS:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("JARVIS API Error:", error);
    return "I'm sorry, sir. I am having trouble connecting to the global network at this time.";
  }
}
