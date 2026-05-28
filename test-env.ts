import { GoogleGenAI } from "@google/genai";
async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API KEY:", apiKey);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    console.log("RESPONSE:", response.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
