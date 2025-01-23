import React, { useState } from 'react'
import '../Styling/AuthForm.'
// import AuthForm from '../Components/AuthForm.jsx'
export default function AuthForm() {
            // value   function
    const [isLogin,setIsLogin]=useState(true);
  return (
    <div className='container'>
        <div className='form-container'>
            <div className='form-toggle'>
                {/* these buttons need to toggle between their states */}
                <button className={isLogin ? 'active' : " "}onClick={()=>setIsLogin(true)}>Login</button>
                <button className={!isLogin ? 'active' : " "}onClick={()=>setIsLogin(false)}>Signup</button>
            </div>
            {isLogin ? <>
                <div className='form'>
                    <h2>Login Form</h2>
                    <input type="email"  placeholder='Email' />
                    <input type="password" placeholder='Password' />
                    <a href='#'>Forgot password</a>
                    <button>Login</button>
                    <p>Not a Member?<a href='#' onClick={()=>setIsLogin(false)} >Signup now</a></p>
                </div>
            </> : <>
            <h2>Signup Form</h2>
                    <input type="email"  placeholder='Email' />
                    <input type="password" placeholder='Password' />
                    <input type="password" placeholder='Confirm Password' />
                    <label htmlFor="options">Choose your Role:</label>
                    <select id="options" name="options">
                        <option value="option1">Employee</option>
                        <option value="option2">Admin</option>
                    </select>

                    <button>SignUp</button>

            </>}
        </div>
         
    </div>
  );
}
