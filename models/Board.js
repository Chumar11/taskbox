import mongoose from "mongoose";

// Card Schema (will be embedded in Lists)
const CardSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => Date.now().toString(),
  },
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

// List Schema (will be embedded in Board)
const ListSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => Date.now().toString(),
  },
  title: {
    type: String,
    required: true,
  },
  cards: [CardSchema], 
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});


const BoardSchema = new mongoose.Schema({
  dashboardId: {
    type: String,
    required: true,
    ref: 'Dashboard' 
  },
  lists: [ListSchema], 
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { timestamps: true });

const Board = mongoose.model("Board", BoardSchema);
export default Board;