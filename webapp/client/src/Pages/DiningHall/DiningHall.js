import 'bootstrap/dist/css/bootstrap.min.css';
import "./DiningHall.css";
import "../App.css"
import { Card } from 'react-bootstrap';
import MenuPage from '../MenuPage/MenuPage.js';
import { useEffect, useState } from 'react';

function DiningHall(props) {
  const [pageState, setPageState] = useState(0);
  const [menuName, setMenuName] = useState("");
  const [locationMenu, setLocationMenu] = useState({})
  const [lastScrollY, setLastScrollY] = useState(0)

  window.scroll({
    top: lastScrollY,
    left: 0,
    behavior: 'instant'
  });

  const locationImages = {
    "Behrend, Bruno's": "/behrend_bruno's.png",
    "Harrisburg, Stacks": "/harrisburg_stacks.png",
    "Harrisburg, The Outpost": "/harrisburg_outpost.png",
    "Berks, Tully's": "/berks_tully's.png",
    "Altoona, Port Sky Cafe": "/altoona_port_sky_cafe.png",
    "Hazleton, HighAcres Cafe": "/hazleton_high_acres.png",
    "Hazleton, Higher Grounds": "/hazleton_higher_grounds.png",
    "Pollock Dining Commons": "/UP_pollock_dining_commons.png",
    "East Food District": "/UP_east_food_district.png"
  }

  useEffect(() => { //basically gets information from prop passed into the file
    if (menuName !== "") {
      const desiredMenu = props.fullMenu.find(menu => menu.Location === menuName)
      setLocationMenu(desiredMenu)
    }
  }, [menuName, props.fullMenu])

  const LocationCard = ({ location, image }) => {
    console.log(`Rendering image for ${location}: ${image}`); //make sure the image is loading correctly
    return (
      <Card 
        style={{ width: "150px", height: "160px", margin: "10px 10px 0px 0px"}}
        onClick={() => {
        setPageState(1)
        setMenuName(location)
        }}>
        <Card.Img variant="top" src={image || "/penn_state_logo.png"}/> 
        <Card.Body>
          <Card.Title style={{ fontSize: "12px"}}>
            {location}
          </Card.Title>
        </Card.Body>
      </Card>
    )
  }

  useEffect(() => {
    if (pageState === 0){
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
    }
  }, [pageState]);

  return (
    <>
      { pageState === 0
        ?
        <>
          <div className="logo" id="logo">
            <img alt="" src="/pennState_nutrition_resized.png" style={{ width: '360px', height: 'auto' }}/>
          </div>
          <div className="content-wrapper">
            <p style={{ height: "1.5em", letterSpacing: "-1px", margin: "0px",}}>–––––––––––&nbsp;&nbsp;&nbsp;Select a location&nbsp;&nbsp;&nbsp;–––––––––––</p>
            <div className="content">
              {props.locations.map((name) => (
                <LocationCard key={name} location={name} image={locationImages[name]}/>
              ))}
          </div>
          </div>
        </>
        : 
        <>
          {
            Object.keys(locationMenu).length !== 0
            ? <MenuPage menuName={menuName} locationMenu={locationMenu} return={() => {setPageState(0)}}/>
            : <></>
          }
        </>
      }
    </>
  );
}

export default DiningHall;