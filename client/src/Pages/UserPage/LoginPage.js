import React, { useState, useEffect, useRef } from 'react'
import './LoginPage.css'
import { FaUser } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { GoTriangleRight } from "react-icons/go";
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const userRef = useRef(); //used to be able to capture user
    const errRef = useRef(); // used to capture the error and annouce it when caught

    const [register, setRegister] = useState(false);
    const [vis, setVis] = useState(false);

    const [username, setUsername] = useState('');
    const [userFocus, setUserFocus] = useState(false);

    const [pswd, setPswd] = useState('');
    const [pswdFocus, setPswdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() =>{
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/api/login',
            {username, password: pswd},
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        ); //Going to the route of api/register, we can pass the contents to db
            
            if(response.status === 200){
                setSuccess(true);
                //history.push('/loading');
            }
            else if(response.status === 404){
                setErrMsg('Username and/or password are incorrect.');
            }
            else{
                setErrMsg('Login Failed');
            }
        }
        catch(err){
            if(err.response.status === 404){
                setErrMsg('Username and/or password are incorrect.');
            }
            else{
                setErrMsg('Login Failed')
            }
        }
    };

    const toggleVisi = () => {
        setVis(prevState => !prevState);
    }

    return(
        <>
            {success ? (
                <section className="sucess-page">
                    {/* <h1>Success!</h1>
                    <div className="register-link">
                        <p>
                            Go to Menu <Link to='/halls'>Here</Link>
                        </p>
                    </div> */}
                    <Navigate to="/halls"/>
                </section>
            ):(
                <div className="big-wrapper">
                    <div className='wrapper'>
                        <form onSubmit={handleSubmit}>
                            <h1>Login</h1>
                            <div className='input-box'> 
                                <FaUser className='icon'/>
                                <input 
                                type='text' 
                                id='username'
                                ref={userRef}
                                placeholder='Username' 
                                required 
                                onChange={(e) => setUsername(e.target.value)} // Changed to properly update state
                                onFocus={() => setUserFocus(true)} // Correctly set focus state
                                />
                            </div>
                            <div className='input-box'>
                                <input 
                                type={vis ? 'text' : 'password'}
                                id='password'
                                placeholder='Password' 
                                required 
                                onChange={(e) => setPswd(e.target.value)} // Changed to properly update state
                                onFocus={() => setPswdFocus(true)} // Correctly set focus state
                                /> 
                            <IoMdEyeOff
                                className="icon-eye"
                                onClick={toggleVisi}
                                style={{ display: vis ? 'none' : 'block' }}
                            />
                            <IoMdEye
                                className="icon-eye"
                                onClick={toggleVisi}
                                style={{ display: vis? 'block' : 'none' }}
                            />
                            </div>

                        <div className='remember-forgot'>
                                <label>
                                    <input 
                                    type='checkbox' 
                                    />
                                    Remember me
                                </label>
                                <a href='#'>Forgot Password?</a> {/* Add the forgot password logic here */}
                        </div>

                            <button
                                onClick={handleSubmit}
                                className='button'
                            >Login</button>
                            <div className='register-link'>
                                <p>Don't have an account? <Link to='/register'>Register</Link> </p>
                            </div>
                        </form>
                        <div className='continue'>
                            <Link to = '/loading'>Continue to the the menu
                            <GoTriangleRight className='next-icon'/>
                            </Link> 
                            
                        </div>
                        <p
                        ref={errRef} className={errMsg ? "instructions" : "offscreen"} aria-live="assertive"
                        >
                        {errMsg}
                    </p>  
                    </div>
                </div>
                )
            }
        </>
    )
}

export default LoginPage;