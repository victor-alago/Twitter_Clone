import React, { useState } from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailed} from '../../redux/userSlice';

const Signup= () => {
    // state management
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

// dispatch
const dispatch = useDispatch();
// navigate
const navigate = useNavigate();

 // handle signup function
 const handleSignup = async (e) => {
    // prevent default form submission
    e.preventDefault();
    dispatch(loginStart());

    // check if password and confirm password match

    // send user data to the server
    try{
      // use axios.post to send user data from the form state to the server
      const res = await axios.post('/auth/signup', {firstname, lastname, username, email, password});
      dispatch(loginSuccess(res.data));
      // navigate to home page after successful login
      navigate('/');      
    }catch(err){
      dispatch(loginFailed());
      // console.log(err);
    }
    
  
  }


  return (
    <form className='bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10'>
      <h2 className='text-Sxl font-bold text-center'>Create an account</h2>

      <input type="text"
        onChange={(e) => setFirstname(e.target.value)}
        placeholder='First Name' 
        required
        className='text-xl py-2 px-4 rounded-full' />

      <input type="text"
        onChange={(e) => setLastname(e.target.value)} 
        placeholder='Last Name' 
        required
        className='text-xl py-2 px-4 rounded-full' />

      <input type="text" 
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username' 
        required
        className='text-xl py-2 px-4 rounded-full' />

      <input type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email' 
        required
        className='text-xl py-2 px-4 rounded-full' />

      <input type="password" 
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password' 
        required
        className='text-xl py-2 px-4 rounded-full' />

      <input type="password" 
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder='Confirm Password' 
        required
        className='text-xl py-2 px-4 rounded-full' />
     

      <button 
        onClick={handleSignup}
        className='text-xl py-2 px-4 rounded-full bg-blue-500 text-white'>
        Sign Up
      </button>

      <p>Have an account? </p> 
      <Link to="/login">
        <p className='text-blue-500 cursor-pointer'>Login</p>
      </Link>
    </form>
    )
}

export default Signup