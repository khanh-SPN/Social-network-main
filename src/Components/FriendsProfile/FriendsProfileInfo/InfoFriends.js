import React from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import './InfoFriend.css';

const InfoFriends = ({ val }) => {
  return (
    <div className='info'>
      <div className="info-cover">
        <img src={val.coverPicture || '/default-cover.jpg'} alt={`${val.username}'s cover picture`} />
        <img src={val.profilePicture || '/default-profile.jpg'} alt={`${val.username}'s profile picture`} />
      </div>
      <div className="info-follow">
        <h1>{val.username}</h1>
        <p>{val.profileTag}</p>
        <div className="info-details">
          <div className="info-col-1">
            <div className="info-details-list">
              <LocationOnOutlinedIcon />
              <span>{val.countryName || 'Unknown'}</span>
            </div>
            <div className="info-details-list">
              <WorkOutlineRoundedIcon />
              <span>{val.jobName || 'Not specified'}</span>
            </div>
            <div className="info-details-list">
              <CalendarMonthRoundedIcon />
              <span>{val.createdAt ? new Date(val.createdAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
          </div>
          <div className="info-col-2">
            <div>
              <h2>{val.followers || 0}</h2>
              <span>Followers</span>
            </div>
            <div>
              <h2>{val.posts || 0}</h2>
              <span>Posts</span>
            </div>
            <div>
              <h2>{val.following || 0}</h2>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoFriends;