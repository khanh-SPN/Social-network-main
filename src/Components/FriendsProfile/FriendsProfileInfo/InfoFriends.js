import React from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import './InfoFriend.css';

const InfoFriends = ({ val }) => {
  return (
    <div className='info'>
      <div className="info-cover">
        <img src={val.coverPicture || val.coverpicture} alt={`${val.username}'s cover picture`} />
        <img src={val.profilePicture || val.profilepicture} alt={`${val.username}'s profile picture`} />
      </div>
      <div className="info-follow">
        <h1>{val.username}</h1>
        <p>{val.profileTag || val.userid}</p>
        <div className="info-details">
          <div className="info-col-1">
            <div className="info-details-list">
              <LocationOnOutlinedIcon />
              <span>{val.countryName || val.ModelCountryName}</span>
            </div>
            <div className="info-details-list">
              <WorkOutlineRoundedIcon />
              <span>{val.jobName || val.ModelJobName}</span>
            </div>
            <div className="info-details-list">
              <CalendarMonthRoundedIcon />
              <span>{val.joinedDate || val.ModelJoinedDate}</span>
            </div>
          </div>
          <div className="info-col-2">
            <div>
              <h2>{val.followers || 0}</h2>
              <span>Followers</span>
            </div>
            <div>
              <h2>1</h2>
              <span>Posts</span>
            </div>
            <div>
              <h2>10</h2>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoFriends;