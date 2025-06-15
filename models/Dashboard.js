import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => Date.now().toString(),
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Dashboard = mongoose.model("Dashboard", DashboardSchema);

export default Dashboard;
