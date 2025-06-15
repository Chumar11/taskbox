import express from "express";
import Dashboard from "../models/Dashboard.js";

const router = express.Router();

// POST - Create a new dashboard
router.post("/dashboards", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const newDashboard = new Dashboard({
      id: Date.now().toString(),
      title,
      description,
      userId,
    });

    const savedDashboard = await newDashboard.save();
    res.status(201).json(savedDashboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating dashboard", error: error.message });
  }
});

// GET - Get all dashboards
router.get("/dashboards/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Finding dashboards for userId:", userId);

    const dashboards = await Dashboard.find({ userId: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(dashboards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboards", error: error.message });
  }
});

// Delete - Delete  a specific dashboard by id
router.delete("/dashboards/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDashboard = await Dashboard.findOneAndDelete({ id });

    if (!deletedDashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    res.status(200).json({
      message: "Dashboard deleted successfully",
      deletedDashboard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting dashboard",
      error: error.message,
    });
  }
});

export default router;
