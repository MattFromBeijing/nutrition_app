import React, { useState, useRef, useEffect } from "react";
import { FaExclamation, FaCheck } from "react-icons/fa6";
import "./RegisterPage.css"
import LoginPage from "./LoginPage";
import { Link } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z0-9-_]{4,24}$/;
const PSWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export const RegisterPage = () => { //tf must be capitalized
    const userRef = useRef(); //used to be able to capture user
    const errRef = useRef(); // used to capture the error and annouce it when caught



    const [user, setUser] = useState(""); //have to update user dynamically
    const [validUser, setValidUser] = useState(false); // whether the username is validated or not
    const [userFocus, setUserFocus] = useState(false); // this is to set the user focus to the user input field when incorrect

    const [pswd, setPswd] = useState("");
    const [validPswd, setValidPswd] = useState(false);
    const [pswdFocus, setPswdFocus] = useState(false);

    const [confirmPswd, setConfirmPswd] = useState("");
    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [sucess, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user); //Whenever user is changed, this useEffect hook will check it agianst the regex
        console.log(result);
        console.log(user);
        setValidUser(result); //if the user passes, set the validUser state
    }, [user]);

    useEffect(() => { //validate password and confirm password
        const result = PSWD_REGEX.test(pswd) //Whenever password is changed, this useEffect hook will check it agianst the regex
        console.log(result);
        console.log(pswd);
        setValidPswd(result) //set the valid password if valid regardless if matching 
    }, [pswd, confirmPswd]);

    useEffect(() => {
        const match = pswd === confirmPswd;
        console.log(match)
        setValidConfirm(match);//This will pass a boolean to whether the password are matching
    }, [pswd, confirmPswd])

    useEffect(() => {
      setErrMsg('');
    }, [user, pswd, confirmPswd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // this is for encryption
        const v1 = USER_REGEX.test(user); //this makes it so that 
        const v2 = PSWD_REGEX.test(pswd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        setSuccess(true);
    }
    

  return (
    <>
    
        <section className="wrapper">
            <p
                ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"
            >
            {errMsg}
            </p>
            <h1>
                Register
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    {/* Basically, you need all te values below to make sure it works properly */}
                    {/* The aria logic runs everytime the page is loeaded, and provides accessibility by giving the instructions in each step */}
                    <input
                    type="text"
                    id="username"
                    ref={userRef}
                    placeholder="Username"
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid = {validUser ? "false": "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    />
                    <FaCheck className={user && validUser ? "check-icon" : "offscreen"} />
                </div>
                <p id="uidnote" className={userFocus && user && !validUser ? "instructions" : "offscreen"}>
                    <FaExclamation className="icon"/>
                    4 to 24 Characters.<br />
                    Only Letters, numbers, underscores, hyphens are allowed.
                </p>
                <div  className="input-box">
                    <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPswd(e.target.value)}
                    value={pswd}
                    autoComplete="off"
                    required
                    aria-invalid = {validPswd ? "false" : 'true'}
                    aria-describedby="pswdnote"
                    onFocus={() => setPswdFocus(true)}
                    onBlur={() => setPswdFocus(false)}
                    />
                    <FaCheck className={pswd && validPswd ? "check-icon" : "offscreen"} />
                </div>
                <p id="pswdnote" className={pswdFocus && pswd && !validPswd ? "instructions" : "offscreen" }>
                    <FaExclamation className="icon"/>
                    At Least 8 Characters.<br />
                    At least 1 uppercase and lowercase letter <br />
                    At least 1 number <br />
                    At least 1 special character from @$!%*#?& <br />
                </p>
                <div className="input-box">
                    {/* */}
                    <input
                    type="password"
                    id="confirm_pswd"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPswd(e.target.value)}
                    autoComplete="off"
                    required
                    aria-invalid = {validConfirm ? "false": "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setPswdFocus(true)}
                    onBlur={() => setPswdFocus(false)}
                    />
                    <FaCheck className={confirmPswd && validConfirm ? "check-icon" : "offscreen"} />
                </div>
                <p id="confirmnote" className={confirmPswd && !validConfirm ? "instructions" : "offscreen" }>
                    <FaExclamation className="icon"/>
                    Passwords do not match.
                </p>
                <div>
                    <button  
                    disabled={!validUser|| !validPswd || !validConfirm ? true : false}
                    className={!validUser|| !validPswd || !validConfirm ? "button disabled" : "button"}
                    > {/* The button doesnt need other attributes because its the only button in the form */}
                    {/* By default, the type of this button will be submit, if its the only one */}
                        Register
                    </button>
                </div>
                <div className='register-link'>
                        <p>Already have an account? <Link to="/">Login</Link> </p>
                </div>
            </form>
        </section>
    </>
  )

}

export default RegisterPage