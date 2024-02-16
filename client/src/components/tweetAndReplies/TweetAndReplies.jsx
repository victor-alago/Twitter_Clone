import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Tweet from '../tweet/Tweet';
import { useParams } from 'react-router-dom';


const TweetAndReplies = () => {
    const [mainTweet, setMainTweet] = useState(null);
    const {currentUser} = useSelector((state) => state.user);
    const {id} = useParams();

    // run this function anytime the user changes
    useEffect(() => {
        const fetchTweets = async () =>  {
            try{
                const tweets = await axios.get(`/tweets/find/${id}`);
                setMainTweet(tweets.data)
            } catch(err){
                console.log(err)
            }
        };
        fetchTweets();
    }, [currentUser.username, id]);

    console.log(mainTweet)

    

  return (
    <div className='mt-6'>
        {mainTweet && mainTweet.map((tweet) => {
            return (<div key={tweet._id} className='p-2'>
                <Tweet tweet={tweet} setData={setMainTweet}/>     
            </div>)
        })}
    </div>
  )
}

export default TweetAndReplies;