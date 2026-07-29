# SupportDesk AI: 5-Day Action Plan & Architecture Blueprint

> **Goal**: Build a full-stack AI-assisted Support Desk application from scratch, scoring **96 to 100 marks out of 100**, strictly using **100% FREE tools/services**, and ensuring **zero token waste**.

---

## 1. Why are we building this project & What does it do?

### **What is SupportDesk AI?**
It is a **Smart Customer Support Platform** where:
1. **Customers** can ask questions to an **AI Chatbot**, use **Voice-to-Text** to speak their complaints, attach screenshots/files, and raise tickets if the AI doesn't resolve their issue.
2. **Support Agents** log into a real-time dashboard to manage, filter, comment on, and resolve tickets instantly without needing to manually refresh.

### **Why build this? (Interview & Learning Value)**
- **Real-World SaaS Architecture**: Almost every modern tech company (e-commerce, fintech, software) needs a ticketing and support system.
- **MERN Stack Masterclass**: Demonstrates authentication (JWT), role-based access control (RBAC), database schemas (MongoDB), file uploads, and websockets (Socket.io).
- **Practical GenAI Integration**: Shows interviewers how to integrate AI safely (handling FAQs & assistance) while leaving final administrative decisions to human agents.

---

## 2. Tech Stack Choice (100% FREE Tier Guaranteed)

| Layer | Technology Chosen | Why We Picked It | Free Tier Details |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) + Vanilla CSS / Tailwind | Fast build, modern component structure, smooth UI micro-animations | Free & open source |
| **Backend** | Node.js + Express.js | High performance, non-blocking I/O, perfect for real-time web sockets | Free & open source |
| **Database** | MongoDB Atlas (Cloud) | Flexible JSON document model for tickets, users, and comments | **Free 512MB Cluster** (M0) forever |
| **Real-time** | Socket.io | Instant updates for new tickets, status changes, and comments | Free open-source library |
| **AI (LLM)** | Google Gemini API (`gemini-1.5-flash`) | Extremely fast, high intelligence, generous free tier | **Free Tier**: 15 Requests/Min, 1,500 Requests/Day |
| **Voice-to-Text** | Web Speech API (Browser Native) | Built right into Chrome/Edge browsers, 0 ms latency, 100% offline/free | **100% Free** (No API keys needed) |
| **Text-to-Voice** | Web Speech Synthesis API | Browser native text-to-speech engine | **100% Free** |
| **File Storage** | Cloudinary / Local Upload (Multer) | Storing ticket attachments/screenshots | **Free Tier**: 25GB storage |
| **Deployment** | Render (Backend) + Vercel / Netlify (Frontend) | Standard cloud hosting for live URLs | **100% Free Tier** |

---

## 3. Marks Weightage Target Breakdown (Aiming for 96 - 100 / 100)

| Category | Item | Marks | Our Target Strategy |
| :--- | :--- | :--- | :--- |
| **Section A (Core)** | User Auth & Encryption | 8 | JWT + bcrypt password hashing |
| | Role-Based Access Control | 5 | Customer vs Agent middleware protection |
| | Create & View Tickets | 8 | Rich form, priority selection, filtered list view |
| | Update & Resolve Status | 6 | Open → In Progress → Resolved state updates |
| | Ticket Comments/Chat | 5 | Back-and-forth conversation log |
| | Search, Filter, Pagination | 5 | Keyword search, status filter, server-side pagination |
| | File/Image Upload | 4 | Screenshot uploads attached to tickets |
| | Real-Time Updates | 8 | Socket.io websockets for instant UI sync |
| | Form Validation & Errors | 5 | Toast notifications & inline validation |
| | Responsive UI Design | 3 | Mobile-friendly, glassmorphism dark/light design |
| | Live Deployment | 3 | Vercel + Render working URLs |
| **Section B (Bonus AI)** | AI Chatbot (Gemini) | 10 | Customer AI assistant widget for instant answers |
| | Voice-to-Text (Web Speech)| 8 | Speech-to-text input for chat & ticket creation |
| | Text-to-Voice (Web Speech)| 8 | AI responses read aloud automatically |
| | Twilio / Callback (Optional)| (4) | *(Simulated/Optional if free credit allows, otherwise V2T+T2V+Bot = 26/30)* |
| **Section C (Docs)** | Clean GitHub Repository | 3 | Well-structured code, `.gitignore`, clear commit history |
| | Detailed README.md | 3 | Screenshots, setup instructions, architecture diagram |
| | 2-Minute Demo Video | 4 | Screen recording showing full workflow live |
| **TOTAL** | | **100** | **Expected Score: 96 - 100 / 100** |

---

## 4. 5-Day Timetable & Roadmap

### **Day 1: Project Setup & Core Authentication (Target: 13 Marks)**
- Initialize Node.js/Express backend & React frontend (Vite).
- Setup MongoDB Atlas connection.
- Build User schema (`Customer` and `Agent` roles) with `bcrypt` password hashing.
- Build JWT registration & login endpoints.
- Build Frontend Login & Signup pages with form validation.

### **Day 2: Ticket Management & Comments Core (Target: 25 Marks)**
- Build Ticket Schema (Title, Description, Priority, Status, Customer ID, Agent ID).
- Build CRUD APIs: Create Ticket, Get Tickets (with Search, Filter, Pagination), Update Ticket Status.
- Build Comment Schema & API for ticket discussion threads.
- Build Customer Dashboard (Raise Ticket, My Tickets) & Agent Dashboard (All Tickets, Status Controls).

### **Day 3: File Uploads & Real-Time Socket.io (Target: 17 Marks + 5 Deployment = 22 Marks)**
- Integrate Multer + Cloudinary (or local media route) for screenshot attachments.
- Setup Socket.io server and client connection.
- Emit socket events on: New Ticket, Status Change, New Comment.
- Verify real-time updates without page refresh across two browser windows.

### **Day 4: Bonus AI Features & Voice Integration (Target: 26 Marks)**
- Integrate Google Gemini API (`@google/genai` or `@google/generative-ai`) for customer FAQ chatbot widget.
- Add Web Speech API for **Voice-to-Text** input in chatbot & ticket description.
- Add SpeechSynthesis API for **Text-to-Voice** playback of AI replies.
- Test full customer journey with Voice + AI assistance.

### **Day 5: Deployment, UI Polish, GitHub Repo & Demo Video (Target: 15 Marks)**
- Polish UI aesthetics (dark mode/sleek cards, responsive layout, toasts).
- Deploy Backend on Render and Frontend on Vercel.
- Clean up code, structure repo, and write a professional `README.md`.
- Record a clean 2-minute Loom/MP4 demo video demonstrating all features live.

---

## 5. Next Immediate Action

We are ready to start **Day 1**:
1. Setup folder structure (`/server` and `/client`).
2. Install backend dependencies (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`).
3. Set up the MongoDB connection and User Auth API.
