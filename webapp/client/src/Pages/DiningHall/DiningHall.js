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

  useEffect(() => {
    if (menuName !== "") {
      const desiredMenu = props.fullMenu.find(menu => menu.Location === menuName)
      setLocationMenu(desiredMenu)
    }
  }, [menuName, props.fullMenu])

  const LocationCard = ({ location }) => {
    return (
      <Card onClick={() => {
        setPageState(1)
        setMenuName(location)
        }}>
        <Card.Img variant="top" src="/penn_state_logo.png"/>
        <Card.Body>
          <Card.Title>
            {location}
          </Card.Title>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      { 
        pageState === 0 
        ?
        <>
          <p className="fs-1 title">Where are we going?</p>
          {props.locations.map((name) => (
            <LocationCard key={name} location={name} />
          ))}
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