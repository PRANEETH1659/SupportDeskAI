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

// All routes require user to be logged in
router.use(protect);

router.route("/").post(createTicket).get(getTickets);

router
  .route("/:id")
  .get(getTicketById)
  .put(authorize("agent"), updateTicketStatus);

router.route("/:id/comments").post(addComment);

module.exports = router;
