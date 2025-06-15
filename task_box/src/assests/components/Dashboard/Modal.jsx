import React from 'react'
import {
  Button,
  Modal,
  Form,
} from "react-bootstrap";

const Page = ({
  showModal,
  handleClose,
  handleCreateBoard,
  newBoardName,
  setNewBoardName,
  newBoardDesc,
  setNewBoardDesc  
}) => {
  return (
      <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Create New Board</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleCreateBoard}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Board Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter board name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    required
                  />
                </Form.Group>
    
                <Form.Group className="mb-3">
                  <Form.Label>Description (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add a description for your board"
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create Board
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
  )
}

export default Page