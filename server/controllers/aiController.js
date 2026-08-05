const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpfull, professional, and concise Support Desk Ai Assistant. Answer the following customer query briefly. If you cannot help, advise them to create a support ticket. Customer Query :${message}`,
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
