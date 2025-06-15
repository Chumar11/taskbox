import express from "express";
import Board from "../models/Board.js";
import User from "../models/User.js";
import BoardUser from "../models/BoardUser.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Add the share board endpoint
router.post("/boards/:boardId/share", authenticateUser, async (req, res) => {
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

    // Check if board exists - FIXED LINE
    const board = await Board.findOne({ dashboardId: boardId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const boardObjectId = board._id.toString();

    // Create a BoardUser entry for the owner if it doesn't exist
    const ownerAccess = await BoardUser.findOne({
      boardId: boardObjectId,
      userId: req.user._id,
    });

    if (!ownerAccess) {
      const ownerBoardUser = new BoardUser({
        boardId: boardObjectId,
        userId: req.user._id,
        role: "owner",
      });
      await ownerBoardUser.save();
    }

    // Check if user already has access
    const existingAccess = await BoardUser.findOne({
      boardId: boardObjectId,
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
          role: role,
        },
      });
    } else {
      // Create new access
      const boardUser = new BoardUser({
        boardId: boardObjectId,
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
          role: role,
        },
      });
    }
  } catch (error) {
    console.error("Share board error:", error);
    res
      .status(500)
      .json({ message: "Error sharing board", error: error.message });
  }
});

export default router;
