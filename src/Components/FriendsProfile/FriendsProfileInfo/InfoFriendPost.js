import React, { useState, useEffect, useContext } from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { LiaFacebookF } from 'react-icons/lia';
import { FiInstagram } from 'react-icons/fi';
import { BiLogoLinkedin } from 'react-icons/bi';
import { AiFillYoutube } from 'react-icons/ai';
import { RxTwitterLogo } from 'react-icons/rx';
import { FiGithub } from 'react-icons/fi';
import Comments from '../../Comments/Comments';
import { likePost, addComment, recommendPost, getComments } from '../../../api';
import { AuthContext } from '../../../index';

const InfoFriendPost = ({ val }) => {
  const { userId } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(val.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [socialIcons, setSocialIcons] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await getComments(val.id);
        setComments(response.comments);
      } catch (error) {
        console.error(error.response?.data?.msg || 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [val.id]);

  const handleLikes = async () => {
    try {
      const response = await likePost(val.id);
      setLike(response.likes);
      setLiked(response.liked);
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to like post');
    }
  };

  const handleCommentInput = async (e) => {
    e.preventDefault();
    try {
      const response = await addComment(val.id, { content: commentInput });
      setComments([...comments, response]);
      setCommentInput('');
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to comment');
    }
  };

  const handleRecommend = async () => {
    try {
      await recommendPost(val.id);
      alert('Post recommended successfully!');
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to recommend post');
    }
  };

  return (
    <div className='post' style={{ marginTop: '10px', marginBottom: '65px' }}>
      <div className='post-header'>
        <div className='post-user'>
          <img src={val.profilePicture || '/default-profile.jpg'} className='p-img' alt={`${val.username}'s profile picture`} />
          <h2>{val.username}</h2>
          <p className='datePara'>{new Date(val.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <p className='body'>{val.content}</p>
      {val.image && <img src={`http://localhost:5000${val.image}`} alt="Post image" className='post-img' />}
      <div className="post-foot">
        <div className="post-footer">
          <div className="like-icons">
            <p
              className='heart'
              onClick={handleLikes}
              style={{ marginTop: '5px' }}
            >
              {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
            </p>
            <MessageRoundedIcon
              onClick={() => setShowComment(!showComment)}
              className='msg'
            />
            <ShareOutlinedIcon
              onClick={() => {
                setSocialIcons(!socialIcons);
                if (!socialIcons) handleRecommend();
              }}
              className='share'
            />
            {socialIcons && (
              <div className="social-buttons">
                <a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon facebook">
                    <LiaFacebookF className='social-links' />
                  </div>
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon instagram">
                    <FiInstagram className='social-links' />
                  </div>
                </a>
                <a href="http://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon linkedin">
                    <BiLogoLinkedin className='social-links' />
                  </div>
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon github">
                    <FiGithub className='social-links' />
                  </div>
                </a>
                <a href="http://youtube.com/" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon youtube">
                    <AiFillYoutube className='social-links' />
                  </div>
                </a>
                <a href="http://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-margin">
                  <div className="social-icon twitter">
                    <RxTwitterLogo className='social-links' />
                  </div>
                </a>
              </div>
            )}
          </div>
          <div className="like-comment-details">
            <span className='post-like'>{like} people like it,</span>
            <span className='post-comment'>{comments.length} comments</span>
          </div>
          {showComment && (
            <div className="commentSection">
              {loading ? (
                <p style={{ textAlign: 'center' }}>Đang tải bình luận...</p>
              ) : (
                <>
                  <form onSubmit={handleCommentInput}>
                    <div className="cmtGroup">
                      <SentimentSatisfiedRoundedIcon className='emoji' />
                      <input
                        type="text"
                        id="commentInput"
                        required
                        placeholder='Add a comment...'
                        onChange={(e) => setCommentInput(e.target.value)}
                        value={commentInput}
                      />
                      <button type='submit'>
                        <SendRoundedIcon className='send' />
                      </button>
                    </div>
                  </form>
                  <div className="sticky">
                    {comments.map((cmt) => (
                      <Comments
                        className="classComment"
                        cmt={cmt}
                        key={cmt.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoFriendPost;