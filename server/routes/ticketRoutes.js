const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  addComment,
} = require("../controllers/ticketController");

const { protect, authorize } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// All routes require user to be logged in
router.use(protect);

router
  .route("/")
  .post(upload.array("attachments", 3), createTicket)
  .get(getTickets);

router
  .route("/:id")
  .get(getTicketById)
  .put(authorize("agent"), updateTicketStatus);

router.route("/:id/comments").post(addComment);

module.exports = router;
