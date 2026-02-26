import React from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers</h1>
      <p>Subscribe to our newsletter</p>
      <div>
        <input type='email' placeholder='Your email' />
        <button>Subscribe</button>
      </div>
    </div>
  );
};

export default NewsLetter;
