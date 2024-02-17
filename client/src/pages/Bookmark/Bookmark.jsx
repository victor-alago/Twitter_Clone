import React from 'react'
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
import Login from '../Login/Login';
import { useSelector } from 'react-redux';
import BookmarkedTweets from '../../components/bookmarkTweets/BookmarkTweets';
import WhoToFollow from '../../components/whoToFollow/WhoToFollow';

const Bookmark = () => {
    const {currentUser} = useSelector((state) => state.user);
  return (
    <>
    {
        !currentUser ? <Login />: (
            <div className='grid grid-cols-1 md:grid-cols-4'> 
                <div className='px-6'>
                    <LeftSideBar />
                </div>

                <div className='col-span-2 border-x-2 border-t-slate-800 px-6'>
                    <BookmarkedTweets />
                </div>

                <div className='px-6'>
                    <WhoToFollow />
          </div>
            </div>
        )
    }

    </>
  )
}

export default Bookmark