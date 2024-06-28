import "./LoadingPage.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";
import DiningHall from "../DiningHall/DiningHall";

function LoadingPage() {
  const [locations, setLocations] = useState([]);
  const [fullMenu, setFullMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/getMenu')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setFullMenu(data);
        const locs = data.map((el) => el.Location).sort();
        setLocations(locs);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);



  return (
    <div className="loading-body">
      {loading ? (
        <div className="mobile-box">
          <div className="flex-center">
            <p className="fs-5 title">Retrieving today's menus</p>
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
        <div className="intro-fade">
          <div className="mobile-box">
            <DiningHall locations={locations} fullMenu={fullMenu} />
          </div>
        </div>

      )}
    </div>
  );
}

export default LoadingPage;