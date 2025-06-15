import React from "react";
import { Col, Dropdown, Card } from "react-bootstrap";

const Page = ({ boards, handleOpenBoard, handleDeleteBoard }) => {
  return (
    <>
      {boards.map((board) => (
        <Col key={board.id}>
          <Card className="h-100 border shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div
                  onClick={() => handleOpenBoard(board)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Title>{board.title}</Card.Title>
                  {board.description && (
                    <Card.Text className="text-muted mt-2 small">
                      {board.description}
                    </Card.Text>
                  )}
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    style={{ border: "none" }}
                  >
                    <i className="bi bi-three-dots"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleOpenBoard(board)}>
                      Open
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={() => handleDeleteBoard(board.id)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white text-muted small">
              <i className="bi bi-calendar me-1"></i>
              Created {new Date(board.createdAt).toLocaleDateString()}
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default Page;
