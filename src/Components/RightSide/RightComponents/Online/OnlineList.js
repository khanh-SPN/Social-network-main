import React from 'react';

const OnlineList = ({ value }) => {
  return (
    <div className='online-people'>
      <img src={value.profilePicture || value.profilepicture} alt={`${value.username}'s profile picture`} />
      <p>{value.username}</p>
    </div>
  );
};

export default OnlineList;