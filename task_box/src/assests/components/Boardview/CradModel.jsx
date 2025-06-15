import React from 'react'
import { Button, Form, Modal } from "react-bootstrap";
const CradModel = ({
    showCardModal,
    handleCloseCardModal,
    handleAddCard,
    newCardContents,activeListForCard,setNewCardContents
   


}) => {
  return (
   <Modal show={showCardModal} onHide={handleCloseCardModal} centered>
           <Modal.Header closeButton>
             <Modal.Title>Create New Card</Modal.Title>
           </Modal.Header>
           <Modal.Body>
             <p className="text-muted">Add a new card to this list.</p>
             <Form.Group className="mb-3">
               <Form.Label>Card Title</Form.Label>
               <Form.Control
                 type="text"
                 placeholder="Enter card title"
                 value={newCardContents[activeListForCard]?.content || ""}
                 onChange={(e) =>
                   setNewCardContents({
                     ...newCardContents,
                     [activeListForCard]: {
                       ...newCardContents[activeListForCard],
                       content: e.target.value,
                     },
                   })
                 }
                 autoFocus
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Card Description</Form.Label>
               <Form.Control
                 as="textarea"
                 rows={3}
                 placeholder="Enter card description (optional)"
                 value={newCardContents[activeListForCard]?.description || ""}
                 onChange={(e) =>
                   setNewCardContents({
                     ...newCardContents,
                     [activeListForCard]: {
                       ...newCardContents[activeListForCard],
                       description: e.target.value,
                     },
                   })
                 }
               />
             </Form.Group>
           </Modal.Body>
           <Modal.Footer>
             <Button variant="secondary" onClick={handleCloseCardModal}>
               Cancel
             </Button>
             <Button
               variant="dark"
               onClick={handleAddCard}
               disabled={
                 !activeListForCard ||
                 !newCardContents[activeListForCard]?.content?.trim()
               }
             >
               Create Card
             </Button>
           </Modal.Footer>
         </Modal>
  )
}

export default CradModel