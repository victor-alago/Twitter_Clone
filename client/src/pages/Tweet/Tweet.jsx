import React, {useState} from 'react';
import LeftSideBar from '../../components/leftSideBar/LeftSideBar';
// import RightSideBar from '../../components/rightSideBar/RightSideBar';
import MainTweet from '../../components/mainTweet/MainTweet';
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
                <MainTweet />
                <form action="" className='border-b-2 pb-6'>
                    <textarea 
                        className='bg-slate-200 rounded-lg w-full p-2 '
                        type='text'
                        maxLength={280}
                        placeholder='What is happening?'
                        name="" 
                        id="" 
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button 
                        className='bg-blue-500 text-white py-2 px-4 rounded-full ml-auto'
                        onClick={handleSubmit}>
                        Tweet
                    </button>
                </form>
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