import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const BoardModelList = ({
  showListModal,
  handleCloseListModal,
  newListTitle,
  setNewListTitle,
  handleAddList,
}) => {
  return (
    <Modal show={showListModal} onHide={handleCloseListModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">Add a new list to organize your cards.</p>
        <Form.Group className="mb-3">
          <Form.Label>List Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter list title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            autoFocus
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseListModal}>
          Cancel
        </Button>
        <Button
          variant="dark"
          onClick={handleAddList}
          disabled={!newListTitle.trim()}
        >
          Create List
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BoardModelList;
