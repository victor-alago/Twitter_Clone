import React, {useState} from 'react';
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
// import RightSideBar from '../../components/rightSideBar/RightSideBar';
import TweetAndReplies from '../../components/tweetAndReplies/TweetAndReplies';
import CreateTweet from '../../components/createTweet/CreateTweet';
import WhoToFollow from '../../components/whoToFollow/WhoToFollow';
import { useSelector } from 'react-redux';
import Login from '../Login/Login';
import axios from 'axios';


const Tweet = () => {
    const [content, setContent] = useState("");
    const {currentUser} = useSelector((state) => state.user);

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const newTweet = await axios.post('/tweets/', {content});
        // IMPLEMENT SOCKET TO UPDATE TIMELINE
        // temporary solution
        window.location.reload(false)
        } catch (error) {
        console.log(error);
        }
    };

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
                <CreateTweet />
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