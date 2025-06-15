import express from "express";
import cors from "cors";
import db from "../dbConnect/db.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import boardRoutes from "../routes/boardRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import shareRoutes from "../routes/shareRoutes.js"
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", shareRoutes);

// Use dashboard routes
app.use("/api", dashboardRoutes);
app.use("/api", boardRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
