import Groq from "groq-sdk";

// אתחול יחיד שכל המערכת תשתמש בו
const groqApi = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groqApi;
