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
