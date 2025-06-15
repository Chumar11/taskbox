"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const BoardContext = createContext();

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};

export const BoardProvider = ({ children }) => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");

  const userStr = localStorage.getItem("user");
  console.log("User string:", userStr);

  let userId = null;
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      console.log("User object:", userObj);
      // Try both _id and id since MongoDB uses _id but your code might use id
      userId = userObj._id || userObj.id;
      console.log("User ID:", userId);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/dashboards/${userId}`
        );
        const data = await response.json();
        console.log(data); // This logs the actual data
        setBoards(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const BoardResponse = await fetch(`http://localhost:5000/api/dashboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newBoardName,
        description: newBoardDesc,
        userId: userId,
      }),
    });

    if (!BoardResponse.ok) {
      const errorData = await BoardResponse.json();
      throw new Error(errorData.message || "Failed to create board");
    }

    const boardData = await BoardResponse.json();
    console.log("List created successfully:", boardData);

    const newBoard = {
      id: boardData.id,
      title: newBoardName,
      description: newBoardDesc,
    };

    // Update boards array
    setBoards([...boards, newBoard]);
    setNewBoardName("");
    setNewBoardDesc("");
    handleClose();
  };

  const handleDeleteBoard = async (boardId) => {
    setBoards(boards.filter((board) => board.id !== boardId));
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboards/${boardId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      console.log("Dashboard deleted:", data);
      return data;
    } catch (error) {
      console.error("Error deleting dashboard:", error);
    }
  };

  const handleOpenBoard = (board) => {
    localStorage.setItem("currentBoard", JSON.stringify(board));
    navigate(`/board/${board.id}`);
  };

  const value = {
    boards,
    showModal,
    newBoardName,
    newBoardDesc,
    handleShow,
    handleClose,
    handleCreateBoard,
    handleDeleteBoard,
    handleOpenBoard,
    setNewBoardName,
    setNewBoardDesc,
    setShowModal,
    setBoards,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
