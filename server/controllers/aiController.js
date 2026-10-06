const { GoogleGenAI } = require("@google/genai");

// gemini-2.5-flash is now limited to older accounts, so we use a current stable model.
// You can switch models any time by setting GEMINI_MODEL in server/.env
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Clear error instead of Google's confusing "default credentials" message
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "AI is not configured. Add GEMINI_API_KEY to server/.env and restart the server.",
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpful, professional, and concise Support Desk AI Assistant. Answer the following customer query briefly. If you cannot help, advise them to create a support ticket. Customer Query: ${message}`,
            },
          ],
        },
      ],
    });

    const aiResponseText = response.text;

    res.status(200).json({ reply: aiResponseText });
  } catch (error) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({ message: "Failed to communicate with AI", error: error.message });
  }
};

module.exports = { chatWithAI };
