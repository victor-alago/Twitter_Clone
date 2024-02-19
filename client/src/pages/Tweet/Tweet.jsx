import React from 'react';
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
import TweetAndReplies from '../../components/tweetAndReplies/TweetAndReplies';
import WhoToFollow from '../../components/whoToFollow/WhoToFollow';
import { useSelector } from 'react-redux';
import Login from '../Login/Login';

const Tweet = () => {
    const {currentUser} = useSelector((state) => state.user);

    return (
        <>
        {!currentUser ? (
        <Login />) : (
            <div className='grid grid-cols-1 md:grid-cols-4'>
            <div className='px-6'>
                <LeftSideBar />
            </div>

            <div className='col-span-2 border-x-2 border-t-slate-800 px-6'>
                <TweetAndReplies />
            </div>

            <div className='px-6'>
                <WhoToFollow />
            </div>
        </div>
        )}
        </>

        
    )
}

export default Tweet  