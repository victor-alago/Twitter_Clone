import React from 'react';
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
import RightSideBar from '../../components/rightSideBar/RightSideBar';
import Timeline from '../../components/timeline/Timeline';
import Login from '../Login/Login';
import "../../../src/App.css";
// import useSelector and useNavigator from react-redux
// cuseSelector checks if a user is signed in or not
// useNavigate is used to navigate to a different page

import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';



const Home = () => {
  // get current user
  const {currentUser} = useSelector((state) => state.user);
  return (
    <>{
      // send user to login if they are not authenticated
      !currentUser ? <Login />: (
        <div className='grid grid-cols-1 md:grid-cols-4'> 

          <div className='px-6 pt-[70px]'>
            <LeftSideBar />
          </div>

          <div className='feed col-span-2 border-x-2 border-t-slate-800 px-6 overflow-y-auto h-screen pt-[70px]'>
            <Timeline/>
          </div>

          <div className='px-6 pt-[70px]'>
            <RightSideBar />
          </div>

      </div>
      )
    }
    </>
    
  )
}

export default Home;