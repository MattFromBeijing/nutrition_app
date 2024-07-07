import 'bootstrap/dist/css/bootstrap.min.css';
import "./DiningHall.css";
import "../App.css"
import { Card, Spinner } from 'react-bootstrap';
// import MenuPage from '../MenuPage/MenuPage.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DiningHall() {
  const [loading, setLoading] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [error, setError] = useState(null);

  const locationNames = [
    "Behrend - Bruno's", "Harrisburg - Stacks", "Harrisburg - The Outpost", "Berks - Tully's", "Altoona - Port Sky Cafe",
    "Hazleton - HighAcres Cafe", "Hazleton - Higher Grounds", "UP: Pollock Dining Commons", "UP: East Food District @ Findlay"
  ]
  const locationImages = {
    "Behrend - Bruno's": "/behrend_bruno's.png",
    "Harrisburg - Stacks": "/harrisburg_stacks.png",
    "Harrisburg - The Outpost": "/harrisburg_outpost.png",
    "Berks - Tully's": "/berks_tully's.png",
    "Altoona - Port Sky Cafe": "/altoona_port_sky_cafe.png",
    "Hazleton - HighAcres Cafe": "/hazleton_high_acres.png",
    "Hazleton - Higher Grounds": "/hazleton_higher_grounds.png",
    "UP: Pollock Dining Commons": "/UP_pollock_dining_commons.png",
    "UP: East Food District @ Findlay": "/UP_east_food_district_resized2.png"
  }
  const location_to_link = {
    "Behrend - Bruno's": "behrend_brunos",
    "Harrisburg - Stacks": "harrisburg_stacks",
    "Harrisburg - The Outpost": "harrisburg_outpost",
    "Berks - Tully's": "berks_tullys",
    "Altoona - Port Sky Cafe": "altoona_port_sky_cafe",
    "Hazleton - HighAcres Cafe": "hazleton_high_acres",
    "Hazleton - Higher Grounds": "hazleton_higher_grounds",
    "UP: Pollock Dining Commons": "UP_pollock_dining_commons",
    "UP: East Food District @ Findlay": "UP_east_food_district"
  }
  const navigate = useNavigate();
  const [activeLocations, setActiveLocations] = useState([])

  window.scroll({
    top: lastScrollY,
    left: 0,
    behavior: 'instant'
  });

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY)
      const logo = document.getElementById('logo');
      const scrollPosition = window.scrollY;

      // let fs = Math.max(50 - (scrollPosition / 5), 0)
      // logo.style.fontSize = `${fs}px`;

      const bv = Math.min(scrollPosition / 25, 10);
      logo.style.filter = `blur(${bv}px)`;

      let op = Math.max(100 - (scrollPosition / 1.5), 0)
      logo.style.opacity = `${op}%`
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getActiveLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data/getActiveLocations',
        {
          params: {locationNames: locationNames},
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      setActiveLocations(response.data)
      setLoading(false)
    } catch (err) {
      setError(err)
      console.error(err)
    }
  }

  useEffect(() => {
    getActiveLocations();
  }, [])

  const LocationCard = ({ location, active, image }) => {
    // console.log(`Rendering image for ${location}: ${image}, status: ${active}`); //make sure the image is loading correctly
    
    if (active) {
      return (
        <Card 
          style={{ width: "150px", height: "160px", margin: "10px 10px 0px 0px"}}
          onClick={() => navigate('/halls/' + location_to_link[location])}
        >
          <Card.Img variant="top" src={image || "/penn_state_logo"}/> 
          <Card.Body>
            <Card.Title style={{ fontSize: "12px"}}>
              {location}
            </Card.Title>
          </Card.Body>
        </Card>
      )
    } else {
      return (
        <Card 
          style={{ width: "150px", height: "160px", margin: "10px 10px 0px 0px", cursor: "default"}}
        >
          <Card.Img variant="top" src={image || "/penn_state_logo"}/> 
          <Card.Body>
            <Card.Title style={{ fontSize: "12px"}}>
              {location}
            </Card.Title>
            <Card.Subtitle style={{ fontSize: "11px", color: "#FF0000" }}>
              Closed
            </Card.Subtitle>
          </Card.Body>
        </Card>
      )
    }
  }

  return (
    <>
      {
        loading ? (
          <div className="mobile-box">
            <div className="flex-center">
              <p className="fs-5 title" style={{ color: "#FFFFFF" }} >Retrieving today's menus</p>
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
            <div className="logo" id="logo">
              <img alt="" src="/pennState_nutrition_resized.png" style={{ width: '360px', height: 'auto' }}/>
            </div>
            <div className="content-wrapper">
              <p style={{ height: "1.5em", letterSpacing: "-1px", margin: "0px",}}>–––––––––&nbsp;&nbsp;&nbsp;Select a location&nbsp;&nbsp;&nbsp;–––––––––</p>
              <div className="content">
                {locationNames.map((name) => (
                  <LocationCard key={name} location={name} active={activeLocations[name]} image={locationImages[name]}/>
                ))}
              </div>
            </div>
          </>
        )
      }
    </>
  );
}

export default DiningHall;