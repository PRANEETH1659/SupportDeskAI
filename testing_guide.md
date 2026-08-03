# 🧪 Support Desk AI — Complete Testing Guide

> **Base URL**: `http://localhost:5000`  
> **Server must be running**: `npm run dev` inside the `server/` folder

---

## 🚀 Step 1 — Start Your Server

```powershell
# In the server/ folder
cd "d:\personal codes\Support Desk AI\server"
npm run dev
```

You should see:
```
Server is running on port number 5000
✅ MongoDB Connected: ...
```

---

## 🛠️ Tool Options (pick one)

| Tool | Best For |
|------|----------|
| **Postman** (recommended) | GUI, easy file uploads, save collections |
| **Thunder Client** (VS Code extension) | Built right in VS Code |
| **curl** (terminal) | Quick CLI testing |

---

## 📋 PHASE 1 — Auth Routes (`/api/auth`)

### ✅ 1.1 Register a Customer

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "name": "John Customer",
  "email": "john@test.com",
  "password": "password123",
  "role": "customer"
}
```

**Expected:** `201` with user object + JWT token

---

### ✅ 1.2 Register an Agent

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "name": "Sarah Agent",
  "email": "sarah@test.com",
  "password": "password123",
  "role": "agent"
}
```

**Expected:** `201` with user object + JWT token  
> 💾 **Save the agent's token — you'll need it for ticket status updates**

---

### ✅ 1.3 Login

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "john@test.com",
  "password": "password123"
}
```

**Expected:** `200` with JWT token  
> 💾 **Save this token as `CUSTOMER_TOKEN`**

---

### ✅ 1.4 Get My Profile (Protected)

**GET** `http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Expected:** `200` with user profile

---

### ❌ 1.5 Test Wrong Password

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "john@test.com",
  "password": "wrongpassword"
}
```

**Expected:** `401` Unauthorized

---

### ❌ 1.6 Access Protected Route Without Token

**GET** `http://localhost:5000/api/auth/me`  
*(No Authorization header)*

**Expected:** `401` Unauthorized

---

## 📋 PHASE 2 — Ticket Routes (`/api/tickets`)

> ⚠️ All ticket routes require `Authorization: Bearer <TOKEN>` header

---

### ✅ 2.1 Create a Ticket (Text Only)

**POST** `http://localhost:5000/api/tickets`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Body (JSON):**
```json
{
  "title": "Cannot login to my account",
  "description": "I keep getting a 403 error when I try to log in from my mobile device.",
  "category": "Account",
  "priority": "HIGH"
}
```

**Expected:** `201` with ticket object + Socket.io emits `ticket_created`

---

### ✅ 2.2 Create a Ticket with File Attachment

**POST** `http://localhost:5000/api/tickets`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Body: `form-data`** *(NOT JSON — switch to form-data in Postman)*

| Key | Type | Value |
|-----|------|-------|
| `title` | Text | `Screenshot of error` |
| `description` | Text | `Here is the screenshot of the error I am seeing` |
| `category` | Text | `Technical` |
| `attachments` | File | *(select a .jpg/.png file)* |

**Expected:** `201` — `attachments` array will contain the file path. File saved in `server/uploads/`

---

### ✅ 2.3 Get All Tickets (Customer sees only their own)

**GET** `http://localhost:5000/api/tickets`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Expected:** `200` with paginated list of YOUR tickets only

---

### ✅ 2.4 Get All Tickets (Agent sees ALL tickets)

**GET** `http://localhost:5000/api/tickets`

**Headers:**
```
Authorization: Bearer <AGENT_TOKEN>
```

**Expected:** `200` with ALL tickets in the system

---

### ✅ 2.5 Filter & Pagination

**GET** `http://localhost:5000/api/tickets?status=OPEN&priority=HIGH&page=1&limit=5`

**Expected:** Filtered results

---

### ✅ 2.6 Search Tickets

**GET** `http://localhost:5000/api/tickets?serach=login`

**Expected:** Tickets matching "login" in title or description

---

### ✅ 2.7 Get a Single Ticket by ID

**GET** `http://localhost:5000/api/tickets/<TICKET_ID>`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Expected:** `200` with full ticket details

---

### ❌ 2.8 Customer Tries to View Another Customer's Ticket

**GET** `http://localhost:5000/api/tickets/<OTHER_CUSTOMERS_TICKET_ID>`

*(Login as a different customer)*

**Expected:** `403` Not authorized

---

### ✅ 2.9 Agent Updates Ticket Status

**PUT** `http://localhost:5000/api/tickets/<TICKET_ID>`

**Headers:**
```
Authorization: Bearer <AGENT_TOKEN>
```

**Body (JSON):**
```json
{
  "status": "IN_PROGRESS",
  "assignedAgent": "<AGENT_USER_ID>"
}
```

**Expected:** `200` + Socket.io emits `ticket_updated`

---

### ❌ 2.10 Customer Tries to Update Ticket Status (Forbidden)

**PUT** `http://localhost:5000/api/tickets/<TICKET_ID>`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Body (JSON):**
```json
{
  "status": "RESOLVED"
}
```

**Expected:** `403` Forbidden — only agents can update status

---

### ✅ 2.11 Add a Comment to a Ticket

**POST** `http://localhost:5000/api/tickets/<TICKET_ID>/comments`

**Headers:**
```
Authorization: Bearer <CUSTOMER_TOKEN>
```

**Body (JSON):**
```json
{
  "message": "I still cannot log in even after clearing my browser cache."
}
```

**Expected:** `201` with full updated ticket + Socket.io emits `comment_added` to the ticket room

---

### ✅ 2.12 Agent Replies to a Comment

**POST** `http://localhost:5000/api/tickets/<TICKET_ID>/comments`

**Headers:**
```
Authorization: Bearer <AGENT_TOKEN>
```

**Body (JSON):**
```json
{
  "message": "We have identified the issue and reset your account. Please try again."
}
```

**Expected:** `201` — comment will show `senderRole: "agent"`

---

## 📋 PHASE 3 — Socket.io Real-Time Testing

### Option A: Use a simple HTML file

Create a file `socket_test.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head><title>Socket Test</title></head>
<body>
  <h2>Socket.io Test</h2>
  <div id="log" style="font-family:monospace;white-space:pre;"></div>
  <script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
  <script>
    const log = (msg) => {
      document.getElementById('log').textContent += msg + '\n';
    };

    const socket = io('http://localhost:5000');

    socket.on('connect', () => log('✅ Connected: ' + socket.id));
    socket.on('disconnect', () => log('❌ Disconnected'));
    socket.on('ticket_created', (data) => log('🎫 NEW TICKET: ' + JSON.stringify(data, null, 2)));
    socket.on('ticket_updated', (data) => log('🔄 TICKET UPDATED: ' + JSON.stringify(data, null, 2)));
    socket.on('comment_added', (data) => log('💬 COMMENT: ' + JSON.stringify(data, null, 2)));

    // Join a specific ticket room (replace with real ticket ID)
    // socket.emit('join_ticket', 'YOUR_TICKET_ID_HERE');

    log('Connecting to http://localhost:5000 ...');
  </script>
</body>
</html>
```

**How to test:**
1. Open this HTML file in browser
2. In Postman, create a ticket or add a comment
3. Watch the events appear live in the browser

---

### Option B: Postman WebSocket (Postman v10+)

1. New Request → **Socket.IO**
2. URL: `http://localhost:5000`
3. Connect → listen for `ticket_created`, `ticket_updated`, `comment_added`

---

## 📋 PHASE 4 — Edge Case / Validation Tests

| Test | Method | Expected |
|------|--------|----------|
| Create ticket without title | POST `/api/tickets` | `400` Missing fields |
| Upload file > 5MB | POST `/api/tickets` form-data | `400` File too large |
| Upload a `.pdf` file | POST `/api/tickets` form-data | `400` Only images allowed |
| Add comment without message body | POST `/api/tickets/:id/comments` | `400` No message |
| Invalid ticket ID format | GET `/api/tickets/invalid123` | `500` Cast error |
| Non-existent ticket ID | GET `/api/tickets/64a1b2c3d4e5f6789012abcd` | `404` Not found |

---

## 📋 PHASE 5 — Valid Enum Values Reference

### Ticket Category
```
"Technical" | "Billing" | "Account" | "General"
```

### Ticket Priority
```
"LOW" | "MEDIUM" | "HIGH" | "URGENT"
```

### Ticket Status (agent-only update)
```
"OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
```

### User Role
```
"customer" | "agent"
```

### Comment senderRole (auto-set from user)
```
"Customer" | "Agent"   ← Note: Title case, trimmed automatically
```

---

## 🔍 Quick curl Commands

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123","role":"customer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Create Ticket (replace TOKEN)
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test","description":"Test description","category":"Technical","priority":"HIGH"}'
```

---

## ✅ What a Passing Test Run Looks Like

```
✅ Register customer          → 201
✅ Register agent             → 201
✅ Login customer             → 200 + token
✅ Get /me                    → 200 + profile
✅ Create ticket (no file)    → 201 + socket fires
✅ Create ticket (with image) → 201 + file in uploads/
✅ Get tickets (customer)     → 200 + only their tickets
✅ Get tickets (agent)        → 200 + all tickets
✅ Filter/search tickets      → 200 + filtered
✅ Get single ticket          → 200
✅ Agent updates status       → 200 + socket fires
✅ Customer can't update      → 403
✅ Add comment                → 201 + socket fires to room
✅ Wrong password             → 401
✅ No token                   → 401
✅ File too large             → 400
✅ Non-image file             → 400
```
