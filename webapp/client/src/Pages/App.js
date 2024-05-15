import "./App.css";
import { useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";
import DiningHall from "./DiningHall/DiningHall.js";

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('/data/getMenu')
      .then((res) => res.json())
      .then((data) => {
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
            <p className="fs-5 title">Loading Locations and Menus</p>
            <Spinner className="spinner" animation="border" role="status"/>
          </div>
        : <DiningHall locations={locations}/>
      }
    </div>
  )
}

export default App;