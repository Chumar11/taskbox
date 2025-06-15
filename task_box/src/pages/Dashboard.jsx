import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useBoard } from "../conrext/BoardContext";
import Card from "../assests/components/Dashboard/Card";
import Modal from "../assests/components/Dashboard/Modal";

const Dashboard = () => {
  const {
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
  } = useBoard();

  return (
    <>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          marginBottom: "10px",
          position: "sticky",
          top: 0,
          left: 0,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h5 className="mb-0" style={{ color: "white" }}>
          Your Boards
        </h5>
        <Button variant="dark" onClick={handleShow} className="rounded">
          <i className="bi bi-plus me-2"></i>Create Board
        </Button>
      </div>
      <Container fluid>
        {boards.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <i
                className="bi bi-kanban"
                style={{ fontSize: "48px", color: "white" }}
              ></i>
            </div>
            <h3 style={{ color: "white" }}>No boards</h3>
            <p style={{ color: "white" }}>
              Get started by creating a new board.
            </p>
            <Button variant="dark" onClick={handleShow} className="mt-2">
              <i className="bi bi-plus me-2"></i>Create Board
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            <Card
              boards={boards}
              handleDeleteBoard={handleDeleteBoard}
              handleOpenBoard={handleOpenBoard}
            />
          </Row>
        )}

        {/* Create Board Modal */}
        <Modal
          showModal={showModal}
          handleClose={handleClose}
          handleCreateBoard={handleCreateBoard}
          newBoardName={newBoardName}
          setNewBoardName={setNewBoardName}
          newBoardDesc={newBoardDesc}
          setNewBoardDesc={setNewBoardDesc}
        />
      </Container>
    </>
  );
};

export default Dashboard;
