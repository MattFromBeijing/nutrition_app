import './MenuPage.css'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Collapse, Modal, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

function MenuPage() {
  const { location } = useParams();
  const link_to_location = {
    "behrend_brunos": "Behrend - Bruno's",
    "harrisburg_stacks": "Harrisburg - Stacks",
    "harrisburg_outpost": "Harrisburg - The Outpost",
    "berks_tullys": "Berks - Tully's",
    "altoona_port_sky_cafe": "Altoona - Port Sky Cafe",
    "hazleton_high_acres": "Hazleton - HighAcres Cafe",
    "hazleton_higher_grounds": "Hazleton - Higher Grounds",
    "UP_pollock_dining_commons": "UP: Pollock Dining Commons",
    "UP_east_food_district": "UP: East Food District @ Findlay"
  }

  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndices, setOpenIndices] = useState([]);
  const [modalState, setModalState] = useState(false);

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

  const getLocationMenu = async (locationName) => {
    try {
      const response = await axios.get('http://localhost:5000/data/getLocationMenu', 
        {
          params: {locationName: link_to_location[locationName]},
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      
      setMenu(response.data)
      setLoading(false)
    } catch (e) {
      setError(e)
      console.error(e)
    }
  }

  useEffect(() => {
    getLocationMenu(location)
  }, [])

  const ItemCard = ({ element, index }) => {
    return (
      <Card onClick={() => {handleClick(index)}} aria-controls="item-info" aria-expanded={openIndices === index}>
        <Card.Title>{element.name}</Card.Title>
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
      {
        loading ? (
          <div className="mobile-box">
            <div className="flex-center">
              <p className="fs-5 title" style={{ color: "#FFFFFF" }} >Retrieving the menu at {menu.location}</p>
              <Spinner className="spinner" style={{ color: "#FFFFFF" }} animation="border" role="status" />
            </div>
          </div>
        ) : error ? (
          <div className="mobile-box">
            <div className="flex-center">
              <p className="fs-5 title text-danger">Error retrieving menu: {error}</p>
              <p className="fs-5 title text-danger">Please try reloading</p>
            </div>
          </div>
        ) : (
          <>
            {/* <Modal dialogClassName="modal-90w" show={modalState} onHide={() => {setModalState(false)}} centered={true}>
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
            </Modal> */}

            <div className="intro-fade">
              {/* <div className="flex-top-right">
                <Button variant="primary-light" onClick={() => {setModalState(true)}} style={{ fontFamily: "Proxima Nova", color: "white" }}>Select a diet</Button>
              </div> */}
              <p className="fs-1 title" style={{ color: "#FFFFFF" }}>{menu.location}</p>
              <p className="fs-6 subtitle" style={{ color: "#FFFFFF" }}>Click on an item</p>
              <p className="fs-6 subtitle" style={{ marginBottom: 15, color: "#FFFFFF" }}>for its nutritional information</p>
              
              {
                time.getTime() < morning &&
                menu.Breakfast.map((element, index) => 
                <ItemCard key={`breakfast-${index}`} element={element} index={index}/>)
              }
              {
                time.getTime() > morning && time.getTime() < noon &&
                menu.Lunch.map((element, index) => 
                <ItemCard key={`lunch-${index}`} element={element} index={index}/>)
              }
              {
                time.getTime() > noon && time.getTime() < evening &&
                menu.Dinner.map((element, index) => 
                <ItemCard key={`dinner-${index}`} element={element} index={index}/>)
              }
            </div>
          </>
        )
      }
    </>
  );
}

export default MenuPage;