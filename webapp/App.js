import logo from './logo.svg';
import './App.css';
import  LoginPage  from './Pages/userPages/loginPage';
import RegisterPage from './Pages/userPages/registerPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<LoginPage />} /> {/* Im pretty sure this is going to be the *homepage */}
          <Route path = '/register' element={<RegisterPage />} /> 
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
