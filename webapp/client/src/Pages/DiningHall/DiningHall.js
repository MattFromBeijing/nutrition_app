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

  useEffect(() => {
    if (menuName !== "") {
      const desiredMenu = props.fullMenu.find(menu => menu.Location === menuName)
      setLocationMenu(desiredMenu)
    }
  }, [menuName, props.fullMenu])

  const LocationCard = ({ location }) => {
    return (
      <Card 
        style={{ width: "150px", height: "160px", margin: "10px 0px 0px 0px"}}
        onClick={() => {
        setPageState(1)
        setMenuName(location)
        }}>
        <Card.Img variant="top" src="/penn_state_logo.png"/>
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
                <LocationCard key={name} location={name} />
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