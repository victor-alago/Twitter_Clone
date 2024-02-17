import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Tweet from '../tweet/Tweet'; // Adjust the path as necessary
import axios from 'axios';

const BookmarkedTweets = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBookmarkedTweets = async () => {
      try {
        const tweets = await axios.get('/tweets/bookmarks');
        setBookmarkedTweets(tweets.data);
      } catch (error) {
        console.log("Error fetching bookmarked tweets:", error);
        setBookmarkedTweets([]); // Set to empty array on error to show "No bookmarked tweets found."
      }
    };

    fetchBookmarkedTweets();
  }, [currentUser.username]);

  return (
    <div className='mt-6'>
      {bookmarkedTweets && bookmarkedTweets.length > 0 ? (
        bookmarkedTweets.map((tweet) => (
          <div key={tweet._id} className='p-2'>
            <Tweet tweet={tweet} setData={setBookmarkedTweets}/>     
          </div>
        ))
      ) : (
        <div className="text-center">
            <h1 className='font-bold text-4xl'>Save posts for later</h1>
            <p className='mt-2'>Bookmark your favorite tweets to view them here.</p>
        </div>
      )}
    </div>
  );
}

export default BookmarkedTweets;
