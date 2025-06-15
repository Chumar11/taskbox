import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card } from "react-bootstrap";
import { useBordview } from "../conrext/BordviewContext";
import BoardModelList from "../assests/components/Boardview/BoardModelList";
import CradModel from "../assests/components/Boardview/CradModel";
import ShareBoardModal from "../assests/components/ShareBoardModal";
import { useBoard } from "../conrext/BoardContext";

const Boardview = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  const {
    lists,
    newListTitle,
    setNewListTitle,
    newCardContents,
    setNewCardContents,
    showListModal,
    showCardModal,
    activeListForCard,
    handleDragEnd,
    handleShowCardModal,
    handleCloseCardModal,
    handleAddList,
    handleShowListModal,
    handleCloseListModal,
    handleDeleteList,
    handleAddCard,
  } = useBordview();

  const { boards = [], handleShow } = useBoard() || {};
  const pathSegments = window.location.pathname.split("/");
  const dashboardId = pathSegments[pathSegments.length - 1];

  const currentBoard = boards?.find(
    (board) => board?.id === dashboardId || board?._id === dashboardId
  );

  const handleOpenShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  return (
    <>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px",
          marginBottom: "10px",
          position: "sticky",
          top: 0,
          left: 0,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          zIndex: 6,
        }}
      >
        <h5 className="mb-0" style={{ color: "white" }}>
          {currentBoard?.title || "Board View"}
        </h5>

        {/* Add Share Button */}
        <div>
          <Button
            variant="outline-light"
            size="sm"
            className="me-2"
            onClick={handleOpenShareModal}
          >
            <i className="bi bi-people me-1"></i> Share
          </Button>
        </div>
      </div>

      <div className="board-view">
        {/* Board content */}
        <div
          className="board-content p-3 d-flex overflow-auto"
          style={{
            minHeight: "calc(100vh - 64px)",
            background:
              "linear-gradient(to bottom, #0f1c2e 0%, #2b1b48 50%, #5a2b77 100%)",
            zIndex: 1111,
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="all-lists"
              direction="horizontal"
              type="list"
            >
              {(provided) => (
                <div
                  className="d-flex"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {/* Map through lists */}
                  {lists.map((list, index) => (
                    <Draggable
                      key={list.id}
                      draggableId={list.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="list me-3"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card
                            className="shadow-sm"
                            style={{ width: "300px" }}
                          >
                            <Card.Header
                              className="d-flex justify-content-between align-items-center bg-light"
                              {...provided.dragHandleProps}
                            >
                              <h6 className="mb-0">{list.title}</h6>
                              <div>
                                <Button
                                  variant="link"
                                  className="p-0 text-dark"
                                  onClick={() => handleDeleteList(list.id)}
                                >
                                  <i className="bi bi-three-dots"></i>
                                </Button>
                              </div>
                            </Card.Header>
                            <Card.Body className="p-2">
                              {/* List cards */}
                              <Droppable droppableId={list.id} type="card">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="list-cards"
                                    style={{ minHeight: "10px" }}
                                  >
                                    {list.cards.map((card, index) => (
                                      <Draggable
                                        key={card.id}
                                        draggableId={card.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="mb-2 shadow-sm"
                                          >
                                            <Card.Body className="p-2">
                                              <div className="d-flex justify-content-between">
                                                <div>
                                                  <p className="mb-1">
                                                    {card.title}
                                                  </p>
                                                  {card.description && (
                                                    <small className="text-muted d-block mb-2">
                                                      {card.description.substring(
                                                        0,
                                                        30
                                                      )}
                                                      ...
                                                    </small>
                                                  )}
                                                  <small className="text-muted">
                                                    {card.user}
                                                  </small>
                                                </div>
                                                {/* <div className="dropdown">
                                                <Button
                                                  variant="link"
                                                  className="p-0 text-secondary dropdown-toggle"
                                                  id={`dropdown-${card.id}`}
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <i className="bi bi-three-dots-vertical"></i>
                                                </Button>
                                                <ul
                                                  className="dropdown-menu dropdown-menu-end"
                                                  aria-labelledby={`dropdown-${card.id}`}
                                                >
                                                  <li>
                                                    <button
                                                      className="dropdown-item"
                                                      onClick={() =>
                                                        handleShowEditCardModal(
                                                          list.id,
                                                          card
                                                        )
                                                      }
                                                    >
                                                      <i className="bi bi-pencil me-2"></i>{" "}
                                                      Edit Card
                                                    </button>
                                                  </li>
                                                  <li>
                                                    <button
                                                      className="dropdown-item text-danger"
                                                      onClick={() =>
                                                        handleDeleteCard(
                                                          list.id,
                                                          card.id
                                                        )
                                                      }
                                                    >
                                                      <i className="bi bi-trash me-2"></i>{" "}
                                                      Delete Card
                                                    </button>
                                                  </li>
                                                </ul>
                                              </div> */}
                                              </div>
                                            </Card.Body>
                                          </Card>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>

                              {/* Add a card form */}
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="w-100 mt-2"
                                onClick={() => handleShowCardModal(list.id)}
                              >
                                <i className="bi bi-plus"></i> Add a card
                              </Button>
                            </Card.Body>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Add a list button or form */}
                  <div className="add-list" style={{ width: "300px" }}>
                    <div className="add-list" style={{ width: "300px" }}>
                      <Button
                        variant="light"
                        className="w-100 h-100 d-flex align-items-center justify-content-center py-4"
                        style={{ minHeight: "100px" }}
                        onClick={handleShowListModal}
                      >
                        <i className="bi bi-plus-circle me-2"></i> Add another
                        list
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {/* dilaog box */}
        <BoardModelList
          showListModal={showListModal}
          handleCloseListModal={handleCloseListModal}
          newListTitle={newListTitle}
          setNewListTitle={setNewListTitle}
          handleAddList={handleAddList}
        />
        {/* Card creation modal */}
        <CradModel
          showCardModal={showCardModal}
          handleCloseCardModal={handleCloseCardModal}
          handleAddCard={handleAddCard}
          newCardContents={newCardContents}
          setNewCardContents={setNewCardContents}
          activeListForCard={activeListForCard}
        />
      </div>
      {/* Share Board Modal */}
      <ShareBoardModal
        show={showShareModal}
        handleClose={handleCloseShareModal}
        boardId={currentBoard?.id}
      />
    </>
  );
};

export default Boardview;
