import React from 'react'
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
import Login from '../Login/Login';
import { useSelector } from 'react-redux';
import MainSettingMenu from '../../components/mainSettingMenu/MainSettingMenu';
import SubSettingAccount from '../../components/subSettingMenu/SubSettingAccount';


const Setting = () => {
    const {currentUser} = useSelector((state) => state.user);
    return (
        <>
          {!currentUser ? (
            <Login />
          ) : (
            // Use flex layout to fill the height of the screen
            <div className='flex flex-col md:flex-row min-h-screen'>
              <div className='flex-none px-6'>
                <LeftSideBar />
              </div>
    
              <div className='flex-grow border-x-2 border-t-slate-800 px-6'>
                <MainSettingMenu />
              </div>
    
              <div className='flex-grow px-6'>
              </div>
            </div>
          )}
        </>
    );
}

export default Setting