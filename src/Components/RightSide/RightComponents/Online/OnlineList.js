import React from 'react';

const BASE_URL = 'http://localhost:5000'; // Có thể lấy từ biến môi trường

const OnlineList = ({ value }) => {
  return (
    <div className='online-people'>
      <img
        src={value.profilePicture ? `${BASE_URL}${value.profilePicture}` : '/images/default-profile.jpg'}
        alt={`${value.username}'s profile picture`}
        onError={(e) => (e.target.src = '/images/default-profile.jpg')}
      />
      <p>{value.username}</p>
    </div>
  );
};

export default OnlineList;