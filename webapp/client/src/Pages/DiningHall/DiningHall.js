import 'bootstrap/dist/css/bootstrap.min.css';
import "./DiningHall.css";
import "../App.css"
import { Spinner } from 'react-bootstrap';
// import MenuPage from '../MenuPage/MenuPage.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DiningHall() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const locationNames = [
    "Altoona - Port Sky Cafe",
    "Behrend - Bruno's",
    "Harrisburg - Stacks",
    "Behrend - Dobbins",
    "Brandywine - Blue Apple Cafe",
    "Mont Alto - The Mill Cafe",
    "UP: Pollock Dining Commons",
    "Beaver - Brodhead Bistro",
    "UP: West Food District @ Waring",
    "UP: South Food District @ Redifer",
    "UP: East Food District @ Findlay",
    "UP: North Food District @ Warnock",
    "Hazleton - HighAcres Cafe",
    "Berks - Tully's"
  ]
  const locationImages = {
    "Altoona - Port Sky Cafe": "/altoona_port_sky_cafe.png",
    "Behrend - Bruno's": "/behrend_bruno's.png",
    "Harrisburg - Stacks": "/harrisburg_stacks.png",
    "Behrend - Dobbins": "/behrend_dobbins.png",
    "Brandywine - Blue Apple Cafe": "/brandywine_blue_apple_cafe.png",
    "Mont Alto - The Mill Cafe": "/mont_alto_the_mill_cafe.png",
    "UP: Pollock Dining Commons": "/up_pollock_dining_commons.png",
    "Beaver - Brodhead Bistro": "/beaver_brodhead_bistro.png",
    "UP: West Food District @ Waring": "/up_west_food_district_at_waring.png",
    "UP: South Food District @ Redifer": "/up_south_food_district_at_redifer.png",
    "UP: East Food District @ Findlay": "/up_east_food_district_at_findlay.png",
    "UP: North Food District @ Warnock": "/up_north_food_district_at_warnock.png",
    "Hazleton - HighAcres Cafe": "/hazleton_highacres_cafe.png",
    "Berks - Tully's": "/berks_tully's.png"
  }
  const location_to_link = {
    "Altoona - Port Sky Cafe": "altoona_port_sky_cafe",
    "Behrend - Bruno's": "behrend_brunos",
    "Harrisburg - Stacks": "harrisburg_stacks",
    "Behrend - Dobbins": "behrend_dobbins",
    "Brandywine - Blue Apple Cafe": "brandywine_blue_apple_cafe",
    "Mont Alto - The Mill Cafe": "mont_alto_the_mill_cafe",
    "UP: Pollock Dining Commons": "up_pollock_dining_commons",
    "Beaver - Brodhead Bistro": "beaver_brodhead_bistro",
    "UP: West Food District @ Waring": "up_west_food_district_at_waring",
    "UP: South Food District @ Redifer": "up_south_food_district_at_redifer",
    "UP: East Food District @ Findlay": "up_east_food_district_at_findlay",
    "UP: North Food District @ Warnock": "up_north_food_district_at_warnock",
    "Hazleton - HighAcres Cafe": "hazleton_highacres_cafe",
    "Berks - Tully's": "berks_tullys"
  }

  const navigate = useNavigate();
  const [activeLocations, setActiveLocations] = useState([])
  const [previewMenu, setPreviewMenu] = useState([])

  const getEasternTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  };
  const time = new Date(getEasternTime());
  const morning = new Date(getEasternTime().setHours(11, 0, 0, 0));
  const noon = new Date(getEasternTime().setHours(16, 0, 0, 0));
  const evening = new Date(getEasternTime().setHours(23, 59, 59, 999));

  const getActiveLocations = async () => {

    try {
      let meal = ""
      if (time <= morning) meal = "Breakfast"
      else if (time > morning && time <= noon) meal = "Lunch"
      else if (time > noon && time <= evening) meal = "Dinner"

      const response = await axios.get('http://localhost:5000/data/getActiveLocations',
        {
          params: {locationNames: locationNames, mealType: meal},
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

  // const getPreviewMenu = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/data/getFullMenu',
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     )
      
  //   } catch (e) {
  //     setError(e)
  //     console.error(e)
  //   }
  // }

  useEffect(() => {
    getActiveLocations();
  }, [])

  const LocationCard = ({ location, active, image }) => {
    // console.log(`Rendering image for ${location}: ${image}, status: ${active}`); //make sure the image is loading correctly
    if (active) {
      return (  
        <div className='hall-card active' onClick={() => navigate('/halls/' + location_to_link[location])}>
          <div className='img-area'>
            <img alt="" src={image || "/penn_state_logo"} 
              width="100%"
              height="auto" />
          </div>

          <div className='text-area'>
            <p className='location'>{location}</p>
            <p className='description'>preview items</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='hall-card inactive'>
          <div className='img-area'>
            <img alt="" src={image || "/penn_state_logo"} width="100%" height="auto" />
          </div>
          <div className='text-area'>
            <p className='location'>{location}</p>
            <p className='description'>Closed</p>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {
        loading ? (
          <div className="loading-screen">
            <p>Retrieving today's menus</p>
            <Spinner className="spinner" animation="border" role="status" />
          </div>
        ) : error ? (
          <div className="loading-screen">
            <p style={{color: "red"}}>Error retrieving menu: {error}</p>
            <p>Please try reloading</p>
          </div>
        ) : (
          <div className='intro-fade'>
            
            <div className="logo" onClick={() => navigate('/halls')}>
              <img alt="" src="/pennState_logo.png" style={{ width: '100px', height: 'auto' }}/>
              <div className='logo-text'>
                <p className="logo-title">PennMeal</p>
                <p className='logo-subtitle'>For growing boys and girls</p>
              </div>
            </div>

            <div className="hall-content-wrapper">
              <p className='title'>Select a location</p>
              <div className="hall-content">
                {locationNames.map((name) => (
                  <LocationCard key={name} location={name} active={activeLocations[name]} image={locationImages[name]}/>
                ))}
              </div>
            </div>

          </div>
        )
      }
    </>
  );
}

export default DiningHall;