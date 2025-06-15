
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "mongoose";

const BordviewContext = createContext();

export const useBordview = () => {
  const context = useContext(BordviewContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};

export const BordviewProvider = ({ children }) => {
  const pathSegments = window.location.pathname.split("/");
  const dashboardId = pathSegments[pathSegments.length - 1];
  // console("Dashboard ID from URL:", dashboardId);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardContents, setNewCardContents] = useState({});
  const [showListModal, setShowListModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [activeListForCard, setActiveListForCard] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [listIId, setListId] = useState(null);

 

  const fetchLists = async (boardId) => {
    try {
      if (!boardId) {
        console.error("boardId is undefined or null");
        return [];
      }

      console.log("Fetching lists for board:", boardId);

      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}/lists`
      );

      // Check HTTP status
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Lists fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchLists:", error);
      throw new Error("Failed to fetch lists");
    }
  };


  useEffect(() => {
    const loadData = async () => {
      try {
        // First get the board
        const boardsResponse = await fetch(
          `http://localhost:5000/api/dashboards/${dashboardId}/boards`
        );
        const boards = await boardsResponse.json();

        if (!boards || boards.length === 0) {
          console.log("No boards found for this dashboard");
          return;
        }

        const boardId = boards[0]._id;
        setBoardId(boardId);
        console.log("Found board ID:", boardId);

        // Then get the lists using the boardId
        const lists = await fetchLists(boardId);
        console.log(lists);

        setListId(lists[0]?.id); // Set the first list ID if available
  

        setLists(lists);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [dashboardId]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination or if item was dropped in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // If we're dragging lists
    if (type === "list") {
      const newListOrder = Array.from(lists);
      const [removed] = newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, removed);
      setLists(newListOrder);
      return;
    }

    // Moving cards
    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );

    // If moving within the same list
    if (sourceList.id === destinationList.id) {
      const newCards = Array.from(sourceList.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      setLists(
        lists.map((list) =>
          list.id === sourceList.id ? { ...list, cards: newCards } : list
        )
      );
    } else {
      // Moving to a different list
      const sourceCards = Array.from(sourceList.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);

      const destinationCards = Array.from(destinationList.cards);
      destinationCards.splice(destination.index, 0, movedCard);

      setLists(
        lists.map((list) => {
          if (list.id === sourceList.id) {
            return { ...list, cards: sourceCards };
          }
          if (list.id === destinationList.id) {
            return { ...list, cards: destinationCards };
          }
          return list;
        })
      );
    }
  };

  const handleShowCardModal = (listId) => {
    setListId(listId);
    setActiveListForCard(listId);
    setShowCardModal(true);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
    setNewCardContents({ ...newCardContents, [activeListForCard]: "" });
  };

  // Add a new list
  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    try {
      // Step 1: Check if a board already exists for this dashboard
      const boardsResponse = await fetch(
        `http://localhost:5000/api/dashboards/${dashboardId}/boards`
      );
      const boards = await boardsResponse.json();
      console.log("Boards fetched:", boards);

      console.log("Boards for dashboard:", boards);

      let boardId;

      // Step 2: If no boards exist, create one
      if (boards.message === "No boards found for this dashboard") {
        console.log("No boards found. Creating a new board...");

        const newBoardResponse = await fetch(
          "http://localhost:5000/api/boards",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dashboardId }),
          }
        );

        if (!newBoardResponse.ok) {
          const errorData = await newBoardResponse.json();
          throw new Error(errorData.message || "Failed to create board");
        }

        const newBoardData = await newBoardResponse.json();
        boardId = newBoardData._id;
        console.log("New board created with ID:", boardId);
      } else {
        // Use existing board
        boardId = boards[0]._id;
        console.log("Using existing board with ID:", boardId);
      }

      // Step 3: Create the list in the board (new or existing)
      const listResponse = await fetch(
        `http://localhost:5000/api/boards/${boardId}/lists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newListTitle }),
        }
      );

      if (!listResponse.ok) {
        const errorData = await listResponse.json();
        throw new Error(errorData.message || "Failed to create list");
      }

      const listData = await listResponse.json();
      console.log("List created successfully:", listData);

      const newList = {
        id: listData.id,
        title: listData.title,
        cards: listData.cards || [],
      };

      setLists([...lists, newList]);
      setNewListTitle("");
      setShowListModal(false);
    } catch (error) {
      console.error("Error in handleAddList:", error);
      // Show error to user
    }
  };

  const handleShowListModal = () => setShowListModal(true);
  const handleCloseListModal = () => {
    setShowListModal(false);
    setNewListTitle(""); // Reset form when closing
  };

  // Delete a list
  const handleDeleteList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  // Add a card to a list
  const handleAddCard = async () => {
    const cardContent = newCardContents[activeListForCard]?.content || "";
    const cardDescription =
      newCardContents[activeListForCard]?.description || "";

    if (!cardContent.trim()) return;
    console.log(boardId, activeListForCard);

    try {
      const boardsResponse = await fetch(
        `http://localhost:5000/api/dashboards/${dashboardId}/boards`
      );
      const boards = await boardsResponse.json();
      console.log("Boards fetched:", boards);

let boardId = boards[0]._id;
      // Add the /api prefix to the URL
      const cardResponse = await fetch(
        `http://localhost:5000/api/boards/${boardId}/lists/${activeListForCard}/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: cardContent,
            description: cardDescription,
          }),
        }
      );

      if (!cardResponse.ok) {
        const errorData = await cardResponse.json();
        throw new Error(errorData.message || "Failed to create card");
      }

      const cardData = await cardResponse.json();
      console.log("Card created successfully:", cardData);

      // Match the properties from your API
      const newCard = {
        id: cardData.id, // Your API returns 'id', not '_id'
        title: cardData.title, // Map API's 'title' to your 'content'
        description: cardData.description,
        user: "Current User", // In a real app, get from auth context
      };

      setLists(
        lists.map((list) =>
          list.id === activeListForCard
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      );

      // Reset form state
      setNewCardContents({
        ...newCardContents,
        [activeListForCard]: { content: "", description: "" },
      });
      setShowCardModal(false);
    } catch (error) {
      // Add error handling
      console.error("Error creating card:", error);
      // Optionally show error to user
      // setError(error.message);
    }
  };

  // Delete a card
  const handleDeleteCard = (listId, cardId) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
          : list
      )
    );
  };

  const value = {
    lists,
    setLists,
    newListTitle,
    setNewListTitle,
    newCardContents,
    setNewCardContents,
    showListModal,
    setShowListModal,
    showCardModal,
    setShowCardModal,
    activeListForCard,
    setActiveListForCard,
   

    // Functions
    handleDragEnd,
    handleShowCardModal,
    handleCloseCardModal,
    handleAddList,
    handleShowListModal,
    handleCloseListModal,
    handleDeleteList,
    handleAddCard,
    handleDeleteCard,
  };

  return (
    <BordviewContext.Provider value={value}>
      {children}
    </BordviewContext.Provider>
  );
};
