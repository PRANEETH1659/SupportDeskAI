# Day 3 Implementation Plan: Socket.io Real-Time Updates & File Uploads

## Goal
Implement **Socket.io real-time event broadcasting** for tickets and comments, and configure **Multer file upload handling** for screenshot attachments, taking our Core Marks from **38 to 55+**.

---

## 1. Technical Architecture & Component Breakdown

### A. Backend (`/server`)
1. **Socket.io Server Integration (`server.js`)**:
   - Wrap Express `app` with HTTP `createServer` and initialize Socket.io `Server`.
   - Set up CORS permissions for frontend client connections.
   - Attach the Socket.io instance to Express app context (`app.set("io", io)`) or emit events directly in controller actions.
   - Handle client connections/disconnections and room join events (e.g., join individual ticket room `ticket:<id>` or global agent room).

2. **Real-Time Event Triggers (`ticketController.js`)**:
   - `createTicket`: Emit `ticket_created` to all online agents.
   - `updateTicketStatus`: Emit `ticket_updated` to the specific customer and agent room.
   - `addComment`: Emit `comment_added` to room `ticket:<id>` so both customer and agent see messages live.

3. **File Upload Engine (Multer Integration)**:
   - Create upload middleware (`middleware/uploadMiddleware.js`) using `multer` with local static disk storage (`server/uploads/`).
   - Expose `/uploads` directory statically via `express.static("uploads")`.
   - Update `ticketRoutes.js` and `createTicket` controller to accept single/multiple image attachments (`attachments` field storing URL path `/uploads/filename`).

---

### B. Frontend (`/client`)
1. **Socket.io Client Context / Hook (`src/context/SocketContext.jsx` or direct connection)**:
   - Establish singleton connection to backend WebSocket server (`socket.io-client`).
   - Listen for `ticket_created`, `ticket_updated`, and `comment_added`.
   - Live update ticket list state and active ticket discussion thread without requiring page reloads.

2. **File Upload UI Component**:
   - Update Ticket Creation Form to support file input (`image/*`).
   - Display screenshot preview thumbnails before submitting.
   - Display attached screenshots in the Ticket Details view with click-to-expand / preview lightbox.

---

## 2. Proposed File Changes

### [Backend]
- #### [MODIFY] [server.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/server.js)
  Initialize `http.createServer` and `socket.io`. Serve `/uploads` directory as static files.
- #### [NEW] [uploadMiddleware.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/middleware/uploadMiddleware.js)
  Configure Multer disk storage, file size limits (e.g. 5MB), and image file filter (jpg, png, webp).
- #### [MODIFY] [ticketRoutes.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/routes/ticketRoutes.js)
  Add Multer upload middleware to ticket creation route (`router.post("/", upload.array("attachments", 3), createTicket)`).
- #### [MODIFY] [ticketController.js](file:///d:/personal%20codes/Support%20Desk%20AI/server/controllers/ticketController.js)
  Process `req.files` for attachments and emit Socket.io events (`ticket_created`, `ticket_updated`, `comment_added`).

### [Frontend]
- #### [NEW] [socket.js](file:///d:/personal%20codes/Support%20Desk%20AI/client/src/socket.js)
  Export Socket.io client instance.
- #### [MODIFY] Ticket List & Ticket Details Views in `client/src/`
  Listen for realtime events to update UI dynamically and add screenshot file attachment upload/preview components.

---

## 3. Verification & Testing Strategy
1. **Multer File Upload**: Test creating a ticket with image attachments via frontend form. Verify file is saved in `server/uploads/` and correctly rendered in frontend ticket view.
2. **Real-Time Websockets**: Open two side-by-side browser windows (one logged in as **Customer**, one as **Agent**).
   - Post a comment or update ticket status from Agent window -> verify instant UI update in Customer window without manual page refresh.
