import supportModel from "../models/supportModel.js";

// to create a support ticket
export async function createSupportTicket(req, res) {
  const userId = req.user._id;
  const { subject, message, category, transactionDetails } = req.body;

  try {
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required"
      });
    }

    const newTicket = new supportModel({
      userId,
      subject,
      message,
      category: category || "Income Query",
      transactionDetails: transactionDetails || null
    });

    await newTicket.save();
    res.json({
      success: true,
      message: "Support ticket created successfully."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

// to get user support tickets
export async function getUserSupportTickets(req, res) {
  const userId = req.user._id;

  try {
    const tickets = await supportModel.find({ userId }).sort({ createdAt: -1 });
    res.json(tickets);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

// to update support ticket status
export async function updateSupportTicketStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTicket = await supportModel.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Support Ticket Not Found."
      });
    }

    res.json({
      success: true,
      message: "Support Ticket Status Updated Successfully...",
      data: updatedTicket
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

// to delete a support ticket
export async function deleteSupportTicket(req, res) {
  try {
    const ticket = await supportModel.findByIdAndDelete({ _id: req.params.id });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support Ticket Not Found."
      });
    }

    return res.json({
      success: true,
      message: "Support Ticket Deleted Successfully."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}