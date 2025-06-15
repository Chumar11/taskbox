import express from "express";
import Board from "../models/Board.js";
import Dashboard from "../models/Dashboard.js";

const router = express.Router();

// 1. CREATE BOARD
router.post("/boards", async (req, res) => {
  try {
    const { dashboardId } = req.body;

    // Validate dashboard exists
    const dashboard = await Dashboard.findOne({ id: dashboardId });
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    const newBoard = new Board({
      dashboardId,
      lists: [],
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. CREATE LIST
router.post("/boards/:boardId/lists", async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const newList = {
      id: Date.now().toString(),
      title,
      cards: [],
    };

    board.lists.push(newList);
    await board.save();

    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE CARD
router.post("/boards/:boardId/lists/:listId/cards", async (req, res) => {
  try {
    const { title, description } = req.body;

    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const list = board.lists.find((list) => list.id === req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const newCard = {
      id: Date.now().toString(),
      title,
      description,
    };

    list.cards.push(newCard);
    await board.save();

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/dashboards/:dashboardId/boards", async (req, res) => {
  try {
    const { dashboardId } = req.params;

    // Find all boards with matching dashboardId
    const boards = await Board.find({ dashboardId });

    if (!boards || boards.length === 0) {
      return res
        .status(404)
        .json({ message: "No boards found for this dashboard" });
    }

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. GET ALL LISTS
router.get("/boards/:boardId/lists", async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json(board.lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. GET ALL CARDS IN A LIST
router.get("/boards/:boardId/lists/:listId/cards", async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const list = board.lists.find((list) => list.id === req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json(list.cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. DELETE LIST
router.delete("/boards/:boardId/lists/:listId", async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const listIndex = board.lists.findIndex(
      (list) => list.id === req.params.listId
    );
    if (listIndex === -1) {
      return res.status(404).json({ message: "List not found" });
    }

    board.lists.splice(listIndex, 1);
    await board.save();

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. DELETE CARD
router.delete(
  "/boards/:boardId/lists/:listId/cards/:cardId",
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const list = board.lists.find((list) => list.id === req.params.listId);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      const cardIndex = list.cards.findIndex(
        (card) => card.id === req.params.cardId
      );
      if (cardIndex === -1) {
        return res.status(404).json({ message: "Card not found" });
      }

      list.cards.splice(cardIndex, 1);
      await board.save();

      res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// 8. DELETE BOARD
router.delete("/boards/:boardId", async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
