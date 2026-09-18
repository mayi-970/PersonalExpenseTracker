import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: "Income Query",
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  transactionDetails: {
    transactionId: { type: String, default: null },
    amount: { type: Number, default: null },
    date: { type: Date, default: null },
  }
}, {
  timestamps: true
});

const supportModel = mongoose.models.support || mongoose.model("support", supportSchema);
export default supportModel;