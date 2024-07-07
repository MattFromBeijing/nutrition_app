import './App.css';
import LoginPage from './UserPage/LoginPage.js';
import RegisterPage from './UserPage/RegisterPage.js';
// import LoadingPage from './LoadingPage/LoadingPage';
import DiningHall from "./DiningHall/DiningHall.js";
import MenuPage from "./MenuPage/MenuPage.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<LoginPage />} /> {/* Im pretty sure this is going to be the *homepage */}
          <Route path = '/register' element={<RegisterPage />} /> 
          <Route path = '/halls'>
            <Route index element={<DiningHall />}/>
            <Route path = ':location' element={<MenuPage />}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;