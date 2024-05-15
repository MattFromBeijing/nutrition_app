import 'bootstrap/dist/css/bootstrap.min.css';
import "./DiningHall.css";
import { Card } from 'react-bootstrap';

function DiningHall(props) {

  const InfoCard = ({ location }) => {
    return (
      <Card onClick={() => {console.log("clicked")}}>
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
      <p className="fs-1 title">Where we going?</p>
      {props.locations.map((name) => (
        <InfoCard key={name} location={name} />
      ))}
    </>
  );
}

export default DiningHall;