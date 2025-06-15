import mongoose from "mongoose";

const BoardUserSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    default: "viewer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can only have one role per board
BoardUserSchema.index({ boardId: 1, userId: 1 }, { unique: true });

const BoardUser = mongoose.model("BoardUser", BoardUserSchema);
export default BoardUser;
