import React, { useState, useContext } from 'react';
import '../Comments/Comments.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { likeComment } from '../../api';
import { AuthContext } from '../../index';

const Comments = ({ cmt }) => {
  const { userId } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(cmt.likes || 0);

  const handleLike = async () => {
    try {
      const response = await likeComment(cmt.id);
      setLiked(response.liked);
      setLikeCount(response.likes);
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to like comment');
    }
  };

  return (
    <div className="overAllCommentList">
      <div className="commentList">
        <div className='commentList1'>
          <div className="commentHead">
            <div>
              <img src={cmt.profilePicture || '/default-profile.jpg'} alt={`${cmt.username}'s profile picture`} />
            </div>
            <p>
              <span>{cmt.username}</span>{cmt.content}
            </p>
          </div>
          <div className="commentFooter">
            <p>{new Date(cmt.createdAt).toLocaleString()}</p>
            <h4>{likeCount} likes</h4>
          </div>
        </div>
        <div className="commentList2">
          <p
            className='cp'
            onClick={handleLike}
            style={{ cursor: 'pointer' }}
          >
            {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;