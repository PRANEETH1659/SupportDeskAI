const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, status } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are Missing ..." });
    }

    let attachments = [];

    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || "General",
      priority: priority || "MEDIUM",
      customer: req.user._id,
      attachments,
    });

    const populatedTicket = await Ticket.findById(ticket._id).populate(
      "customer",
      "name email",
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("ticket_created", populatedTicket);
    }

    res.status(201).json({
      message: "Query Successfully Raised...",
      ticket: populatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purpose : get tickets with search , filter and pagination   .  Route : GET/api/tickets

const getTickets = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === "customer") {
      query.customer = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({
      tickets,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get single ticket . GET /api/tickets/:id
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found" });
    }

    if (
      req.user.role === "customer" &&
      ticket.customer._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view the ticket " });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status or assinging event  . PUT /api/tickets/:id

const updateTicketStatus = async (req, res) => {
  try {
    const { status, priority, assignedAgent } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not Found " });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedAgent) ticket.assignedAgent = assignedAgent;

    const updatedTicket = await ticket.save();
    const populatedTicket = await Ticket.findById(updatedTicket._id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");
    const io = req.app.get("io");
    if (io) {
      io.emit("ticket_updated", populatedTicket);
      io.to(`ticket:${ticket._id}`).emit("ticket_updated", populatedTicket);
    }

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to Tickt   . POST /api/tickets/:id/comments

const addComment = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No Message Found " });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket Not Found " });
    }

    const comment = {
      user: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role === "agent" ? "Agent" : "Customer",
      message,
    };

    ticket.comments.push(comment);
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");

    const io = req.app.get("io");
    if (io) {
      io.to(`ticket:${ticket._id}`).emit("comment_added", {
        ticketId: ticket._id,
        comments: updatedTicket.comments,
      });
    }

    res.status(201).json(updatedTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  addComment,
};
