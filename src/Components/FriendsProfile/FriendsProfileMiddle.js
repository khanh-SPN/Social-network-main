import React from 'react';
import InfoFriends from './FriendsProfileInfo/InfoFriends';
import InfoFriendPost from './FriendsProfileInfo/InfoFriendPost';

const FriendsProfileMiddle = ({ friendProfile }) => {
  return (
    <div style={{ paddingBottom: '30px' }}>
      {friendProfile && friendProfile.length > 0 ? (
        <>
          {friendProfile.map((val) => (
            <InfoFriends val={val} key={val.id} />
          ))}
          {friendProfile.map((val) => (
            <InfoFriendPost val={val} key={val.id} />
          ))}
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Không có thông tin để hiển thị</p>
      )}
    </div>
  );
};

export default FriendsProfileMiddle;