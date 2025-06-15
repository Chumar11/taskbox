import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import User from "../models/User.js";
import Board from "../models/Board.js";
import BoardUser from "../models/BoardUser.js";

const router = express.Router();

// Apply authentication middleware to all board routes
router.use("/boards", authenticateUser);

// Your existing board routes...

// Add share board route
router.post("/boards/:boardId/share", async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email, role } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }
    
    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    
    // Check if current user is owner
    const currentUserAccess = await BoardUser.findOne({
      boardId: boardId,
      userId: req.user._id,
    });
    
    if (!currentUserAccess || currentUserAccess.role !== "owner") {
      return res.status(403).json({ message: "Only board owners can share boards" });
    }

    // Check if user already has access
    const existingAccess = await BoardUser.findOne({
      boardId: boardId,
      userId: user._id,
    });

    if (existingAccess) {
      // Update existing access
      existingAccess.role = role;
      await existingAccess.save();
      return res.status(200).json({ 
        message: `User access updated to ${role}`,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: role
        }
      });
    } else {
      // Create new access
      const boardUser = new BoardUser({
        boardId: boardId,
        userId: user._id,
        role,
      });
      await boardUser.save();
      
      return res.status(200).json({ 
        message: `Board shared with ${email} as ${role}`,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: role
        }
      });
    }
  } catch (error) {
    console.error("Share board error:", error);
    res.status(500).json({ message: "Error sharing board", error: error.message });
  }
});

export default router;