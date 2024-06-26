import React, { useState, useEffect } from 'react'
import './loginPage.css'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import RegisterPage from './registerPage';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [register, setRegister] = useState(false);

        
    const handleClick = () => {
        setRegister(true);
    }

    
    return(
        <div className='wrapper'>
            <form 
            action=''
            >
                <h1>Login</h1>
                <div className='input-box'> 
                    <FaUser className='icon'/>
                    <input 
                    type='text' 
                    placeholder='Username' 
                    required 
                    />
                </div>
                <div className='input-box'>
                    <FaLock className='icon '/>
                    <input 
                    type='password' 
                    placeholder='Password' 
                    required 
                    /> 
                </div>

               <div className='remember-forgot'>
                    <label>
                        <input 
                        type='checkbox' 
                        />
                        Remember me
                    </label>
                    <a href='#'>Forgot Password?</a>
               </div>

               <button
               type='submit'
               className='button'
               >Login</button>
                <div className='register-link'>
                    <p>Don't have an account? <Link to='/register'>Register</Link> </p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;