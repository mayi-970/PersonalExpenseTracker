import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
  createSupportTicket, 
  getUserSupportTickets, 
  updateSupportTicketStatus, 
  deleteSupportTicket 
} from '../controllers/supportController.js';

const supportRouter = express.Router();

supportRouter.post("/add", authMiddleware, createSupportTicket);
supportRouter.get("/get", authMiddleware, getUserSupportTickets);

supportRouter.put("/update/:id", authMiddleware, updateSupportTicketStatus);
supportRouter.delete("/delete/:id", authMiddleware, deleteSupportTicket);

export default supportRouter;