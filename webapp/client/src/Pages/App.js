import "./App.css";
import { useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";
import DiningHall from "./DiningHall/DiningHall.js";

function App() {
  const [locations, setLocations] = useState([]);
  const [fullMenu, setFullMenu] = useState([]);

  useEffect(() => {
    fetch('/data/getMenu')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setFullMenu(data)
        const locs = data.map((el) => {
          return el.Location
        }).sort()
        setLocations(locs)
      });
  }, [])

  return(
    <div className="mobile-box">
      {
        locations.length === 0 
        ? 
          <div className="flex-center">
            <p className="fs-5 title">Downloading today's menus</p>
            <Spinner className="spinner" style={{ color: "#162952" }}animation="border" role="status"/>
          </div>
        : <DiningHall locations={locations} fullMenu={fullMenu}/>
      }
    </div>
  )
}

export default App;