import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import TimelineTweets from '../timelineTweets/TimelineTweets';
import axios from 'axios';

const Timeline = () => {
  const [content, setContent] = useState("");
  // to implement media upload
  // const [media, setMedia] = useState("");
  const {currentUser} = useSelector((state) => state.user);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tweets/', {content});
      // IMPLEMENT SOCKET TO UPDATE TIMELINE
      // temporary solution
      window.location.reload(false)
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>{
      currentUser && (        
        <p className='font-bold pl-2 my-2'>{currentUser.username}</p>
      )}
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
        <TimelineTweets />
    </div>
  )
}

export default Timeline