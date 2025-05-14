import React, { useState } from 'react';
import '../Comments/Comments.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const Comments = ({ cmt }) => {
  const [booleonLike, setBooleonLike] = useState(false);
  const [likeCount, setLikeCount] = useState(cmt.likes || 0);

  const handleLike = () => {
    setBooleonLike(!booleonLike);
    setLikeCount(booleonLike ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="overAllCommentList">
      <div className="commentList">
        <div className='commentList1'>
          <div className="commentHead">
            <div>
              <img src={cmt.profilePic || cmt.userProfilePicture} alt={`${cmt.username}'s profile picture`} />
            </div>
            <p>
              <span>{cmt.username}</span>{cmt.content || cmt.comment}
            </p>
          </div>
          <div className="commentFooter">
            <p>{cmt.time || new Date(cmt.createdAt).toLocaleString()}</p>
            <h4>{booleonLike ? likeCount + 1 : likeCount} likes</h4>
          </div>
        </div>
        <div className="commentList2">
          <p
            className='cp'
            onClick={handleLike}
            style={{ cursor: 'pointer' }}
          >
            {booleonLike ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;