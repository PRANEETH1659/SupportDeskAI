const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, status } = req.body;

    if (!title || !description) {
      return res
        .send(400)
        .json({ message: "Title and Description are Missing ..." });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || "General",
      priority: priority || "MEDIUM",
      customer: req.user.id,
    });

    res.status(200).json({ message: "Query Sucessfully Raised..." }, ticket);
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

    if (req.query.serach) {
      query.$or = [
        { title: { $regex: req.query.serach, $options: "i" } },
        { description: { $regex: req.query.serach, $options: "i" } },
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
    res.send(500).json({ message: error.message });
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
    res.json(updatedTicket);
  } catch (erorr) {
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
      return res.status(404).json({ error: "User Not Found " });
    }

    const comment = {
      user: req.user._id,
      senderName: req.user.name,
      senderRole: (req.user.role || "customer").trim(),
      message,
    };

    ticket.comments.push(comment);
    await ticket.save();

    res.status(201).json(ticket);
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
