const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["Customer", "Agent"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Add the Title of Ticket.."],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Explain your issue please.."],
    },

    category: {
      type: String,
      enum: ["Technical", "Billing", "Account", "General"],
      default: "General",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "IN_PROGRESS",
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    attachments: [
      {
        type: String,
      },
    ],

    comments: [commentSchema],
  },

  { timestamps: true },
);

module.exports = mongoose.model("Ticket", ticketSchema);
