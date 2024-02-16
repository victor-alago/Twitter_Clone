import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import Tweet from '../tweet/Tweet';
import axios from 'axios';

const ExploreTweets = () => {
  const [exploreTweets, setExploreTweets] = useState(null);
  const { currentUser } = useSelector((state) => state.user);


  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweets = await axios.get('/tweets/explore/');
        setExploreTweets(tweets.data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchTweets();
  }, [currentUser.username])

  console.log(exploreTweets);

  return (
    <div className='mt-6'>
        {exploreTweets && exploreTweets.map((tweet) => {
            return (<div key={tweet._id} className='p-2'>
                <Tweet tweet={tweet} setData={setExploreTweets}/>     
            </div>)
        })}
    </div>
  )
}

export default ExploreTweets