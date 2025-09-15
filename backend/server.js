const express = require("express");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(express.static(path.join(__dirname, 'public')));


// Placeholder reply logic — echo or call an external API
async function generateReply(userMessage) {
  // If you want to integrate a real AI model, replace this logic.
  // For example, using OpenAI:
  //
  // const { Configuration, OpenAIApi } = require("openai");
  // const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  // const openai = new OpenAIApi(configuration);
  // const completion = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: userMessage }],
  // });
  // return completion.data.choices[0].message.content;

  return `You said: “${userMessage}”`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }
    const reply = await generateReply(message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
