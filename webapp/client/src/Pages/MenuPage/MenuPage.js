import './MenuPage.css'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Collapse, Modal } from 'react-bootstrap';
import { useState } from 'react';

function MenuPage(props) {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'instant'
  });

  const [openIndices, setOpenIndices] = useState([]);
  const [modalState, setModalState] = useState(false)

  const getEasternTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  };

  const time = new Date(getEasternTime());
  const morning = new Date(getEasternTime().setHours(11, 0, 0, 0));
  const noon = new Date(getEasternTime().setHours(16, 0, 0, 0));
  const evening = new Date(getEasternTime().setHours(23, 59, 59, 999));

  const submitFilter = () => {
    setModalState(false)
  }

  const handleClick = (index) => {
    setOpenIndices((curr) => {
      if (curr.includes(index)) {
        return curr.filter(i => i !== index);
      } else {
        return [...curr, index];
      }
    });
  };
  
  const ItemCard = ({ item, index }) => {
    return (
      <Card onClick={() => {handleClick(index)}} aria-controls="item-info" aria-expanded={openIndices === index}>
        <Card.Title>{item.name}</Card.Title>
        <Collapse in={openIndices.includes(index)}>
          <div className="transition-wrapper" id="item-info">
            <Card.Text>nothin here yet</Card.Text>
          </div>
        </Collapse>
      </Card>
    )
  }

  return (
    <>
      <Modal dialogClassName="modal-90w" show={modalState} onHide={() => {setModalState(false)}} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Diet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex-center">
            <Button variant="primary" onClick={() => {submitFilter()}}>Apply Diet</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="intro-fade">
        <div className="flex-top-left">
          <Button variant="primary-light" onClick={props.return} style={{ fontFamily: "Proxima Nova", color: "white" }}>Back</Button>
        </div>
        <div className="flex-top-right">
          <Button variant="primary-light" onClick={() => {setModalState(true)}} style={{ fontFamily: "Proxima Nova", color: "white" }}>Select a diet</Button>
        </div>
        <p className="fs-1 title">{props.menuName}</p>
        <p className="fs-6 subtitle">Click on an item</p>
        <p style={{ marginBottom: 15 }} className="fs-6 subtitle">for its nutritional information</p>
        
        {
          time.getTime() < morning &&
          props.locationMenu.Breakfast.map((item, index) => 
          <ItemCard key={`breakfast-${index}`} item={item} index={index}/>)
        }
        {
          time.getTime() > morning && time.getTime() < noon &&
          props.locationMenu.Lunch.map((item, index) => 
          <ItemCard key={`lunch-${index}`} item={item} index={index}/>)
        }
        {
          time.getTime() > noon && time.getTime() < evening &&
          props.locationMenu.Dinner.map((item, index) => 
          <ItemCard key={`dinner-${index}`} item={item} index={index}/>)
        }
      </div>
    </>
  );
}

export default MenuPage;