import './MenuPage.css'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Collapse } from 'react-bootstrap';
import { useState } from 'react';

function MenuPage(props) {
  const [openIndex, setOpenIndex] = useState(-1);

  const getEasternTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  };

  const time = new Date(getEasternTime());
  const morning = new Date(getEasternTime().setHours(11, 0, 0, 0));
  const noon = new Date(getEasternTime().setHours(16, 0, 0, 0));
  const evening = new Date(getEasternTime().setHours(23, 59, 59, 999));
  
  const ItemCard = ({ item, index }) => {
    return (
      <Card onClick={() => {openIndex === -1 ? setOpenIndex(index) : setOpenIndex(-1)}} aria-controls="item-info" aria-expanded={openIndex === index}>
        <Card.Title>{item.name}</Card.Title>
        <Collapse in={openIndex === index} appear={true}>
          <div className="transition-wrapper" id="item-info">
            <Card.Text >nothin here yet</Card.Text>
          </div>
        </Collapse>
      </Card>
    )
  }

  return (
    <>
      <div className="flex-top-left">
        <Button variant="primary-light" onClick={props.return}>Back</Button>
      </div>
      <p className="fs-1 title">{props.menuName}</p>
      <p className="fs-6 title subtitle">👆Click on an item</p>
      <p className="fs-6 title subtitle">for its nutritional information</p>
      {
        time.getTime() < morning &&
        props.locationMenu.Breakfast.map((item, index) => 
        <ItemCard key={index} item={item} index={index}/>)
      }
      {
        time.getTime() > morning && time.getTime() < noon &&
        props.locationMenu.Lunch.map((item, index) => 
        <ItemCard key={index} item={item} index={index}/>)
      }
      {
        time.getTime() > noon && time.getTime() < evening &&
        props.locationMenu.Dinner.map((item, index) => 
        <ItemCard key={index} item={item} index={index}/>)
      }
    </>
  );
}

export default MenuPage;