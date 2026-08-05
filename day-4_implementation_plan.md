# SupportDesk AI - Day 4: AI Chatbot & Voice Integration

Based on our complete 5-day roadmap, we have successfully completed:
- **Day 1**: Core Authentication & Setup
- **Day 2**: Ticket Management & Comments
- **Day 3**: File Uploads & Real-Time Socket.io

We are now ready for **Day 4: Bonus AI Features & Voice Integration**. This will significantly boost the project's uniqueness and interview value by adding intelligent self-service.

## Goal
Integrate Google Gemini AI to act as a Level 1 Support Bot for customers. Add Voice-to-Text for chat and ticket creation, and Text-to-Voice for AI responses.

## User Review Required
> [!IMPORTANT]  
> We will need a valid Google Gemini API key to proceed. If you don't have one, you can get it for free at [Google AI Studio](https://aistudio.google.com/). We will add this to your backend `.env` file as `GEMINI_API_KEY`. Please confirm if you have this key ready.

## Proposed Changes

---

### Backend API (`/server`)

#### [NEW] [aiController.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/controllers/aiController.js)
Create a new controller to handle requests to the Google Gemini API.
- Initialize the `@google/genai` client.
- Create a `chatWithAI` function that receives the user's message, passes it to Gemini with a system prompt instructing it to act as a helpful Support Desk AI assistant, and returns the response.

#### [NEW] [aiRoutes.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/routes/aiRoutes.js)
- Define a `POST /api/ai/chat` endpoint mapped to the `chatWithAI` controller.

#### [MODIFY] [server.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/server.js)
- Import and mount the `aiRoutes` on the `/api/ai` path.

---

### Frontend Features (`/client`)

#### [NEW] [useSpeechRecognition.js](file:///d:/personal%20codes/Support%20Desk%20AI/client/src/hooks/useSpeechRecognition.js)
- A custom React hook wrapping the browser's native `SpeechRecognition` API. This will handle listening to the user's microphone and converting speech to text (100% free, browser-native).

#### [NEW] [useSpeechSynthesis.js](file:///d:/personal%20codes/Support%20Desk%20AI/client/src/hooks/useSpeechSynthesis.js)
- A custom React hook wrapping the browser's native `SpeechSynthesis` API to read out AI responses automatically.

#### [NEW] [AiChatWidget.jsx](file:///d:/personal%20codes/Support%20Desk%20AI/client/src/components/AiChatWidget.jsx)
- A floating chat UI for the Customer Dashboard.
- Will allow customers to type or **speak** their questions.
- Will display AI responses and **read them aloud**.
- If the AI cannot resolve the issue, it will suggest raising a ticket.

#### [MODIFY] Ticket Creation Form
- Integrate the `useSpeechRecognition` hook so customers can dictate their ticket descriptions using voice instead of typing.

---

## Verification Plan

### Manual Verification
1. Click the microphone icon in the new AI Chat Widget and speak a question (e.g., "How do I reset my password?").
2. Verify that the spoken words are transcribed to text correctly.
3. Verify that the backend calls Gemini API and returns a relevant support response.
4. Verify that the browser reads the response out loud.
5. Verify that the microphone dictation works on the Create Ticket page.
