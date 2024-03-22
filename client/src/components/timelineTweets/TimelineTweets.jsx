import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Tweet from '../tweet/Tweet';

const TimelineTweets = () => {
    const [timelineTweets, setTimelineTweets] = useState(null);
    const {currentUser} = useSelector((state) => state.user);

    // use effect hook can't be asynchronous, so we use an async function inside the hook
    useEffect(() => {
        const fetchTweets = async () =>  {
            try{
                const tweets = await axios.get('/tweets/timeline');
                setTimelineTweets(tweets.data)
            } catch(err){
                console.log(err)
            }
        };
        fetchTweets();
    }, [currentUser.username]);

    // console.log(timelineTweets)

    

  return (
    <div className='mt-6'>
        {timelineTweets && timelineTweets.map((tweet) => {
            return (<div key={tweet._id} className='p-2'>
                <Tweet tweet={tweet} setData={setTimelineTweets}/>     
            </div>)
        })}
    </div>
  )
}

export default TimelineTweets