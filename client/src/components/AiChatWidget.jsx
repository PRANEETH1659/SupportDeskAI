import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles, X, Mic, Send } from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I am the SupportDesk AI. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Destructure our custom Voice-to-Text and Text-to-Voice hooks!
  const {
    text: speechText,
    isListening,
    startListening,
    stopListening,
    setText: setSpeechText,
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking } = useSpeechSynthesis();

  // Helper function to auto-scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When the microphone hears something, automatically paste it into the input box
  useEffect(() => {
    if (speechText) {
      setInputText(speechText);
    }
  }, [speechText]);

  // Handle sending a message to the Gemini API Backend
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;

    // 1. Add the User's message to the chat UI immediately
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // 2. Clear the input boxes
    setInputText("");
    setSpeechText("");
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 3. Make the API Call to our Node backend
      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        message: userMessage,
      });

      const aiReply = response.data.reply;

      // 4. Add the AI's reply to the chat UI
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);

      // 5. Read out the AI's response aloud!
      speak(aiReply);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I am having trouble connecting to my brain right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to toggle the microphone on and off
  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking(); // Stop AI speaking if user starts talking
      startListening();
    }
  };

  // If the widget is CLOSED, show the floating button
  if (!isOpen) {
    return (
      <button className="ai-widget-toggle" onClick={() => setIsOpen(true)}>
        <Sparkles size={17} /> Ask AI Support
      </button>
    );
  }

  // If the widget is OPEN, show the full chat window
  return (
    <div className="ai-widget-panel">
      {/* --- Chat Header --- */}
      <div className="ai-widget-header">
        <div className="ai-widget-title">
          <Sparkles size={17} /> SupportDesk AI
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            stopSpeaking();
          }}
          className="ai-widget-close"
        >
          <X size={16} />
        </button>
      </div>

      {/* --- Chat Message Area --- */}
      <div className="ai-widget-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message ${msg.sender}`}>
            <div className="ai-bubble">{msg.text}</div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="ai-message ai">
            <div className="ai-bubble">
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Bottom Input Form --- */}
      <form onSubmit={handleSend} className="ai-widget-form">
        <button
          type="button"
          onClick={toggleListen}
          className={`ai-mic-btn ${isListening ? "listening" : ""}`}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          <Mic size={17} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or speak..."
          className="form-control"
          style={{ borderRadius: "20px" }}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="ai-send-btn"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AiChatWidget;
