import React, { useState, useEffect, useContext } from 'react';
import '../Home/Post.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import { PiSmileySad } from 'react-icons/pi';
import { IoVolumeMuteOutline } from 'react-icons/io5';
import { MdBlockFlipped } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdReportGmailerrorred } from 'react-icons/md';
import { LiaFacebookF } from 'react-icons/lia';
import { FiInstagram } from 'react-icons/fi';
import { BiLogoLinkedin } from 'react-icons/bi';
import { AiFillYoutube } from 'react-icons/ai';
import { RxTwitterLogo } from 'react-icons/rx';
import { FiGithub } from 'react-icons/fi';
import Comments from '../Comments/Comments';
import { likePost, addComment, recommendPost, deletePost, getComments } from '../../api';
import { AuthContext } from '../../index';

const PostUser = ({ posts, post, setPosts, user }) => {
  const { userId } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [socialIcons, setSocialIcons] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await getComments(post.id);
        setComments(response.comments);
      } catch (error) {
        console.error(error.response?.data?.msg || 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [post.id]);

  const handleLikes = async () => {
    try {
      const response = await likePost(post.id);
      setLike(response.likes);
      setLiked(response.liked);
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to like post');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      setPosts(posts.filter(val => val.id !== post.id));
      setShowDelete(false);
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to delete post');
    }
  };

  const handleCommentInput = async (e) => {
    e.preventDefault();
    try {
      const response = await addComment(post.id, { content: commentInput });
      setComments([...comments, response]);
      setCommentInput('');
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to comment');
    }
  };

  const handleRecommend = async () => {
    try {
      await recommendPost(post.id);
      alert('Bài viết được đề xuất thành công!');
    } catch (error) {
      console.error(error.response?.data?.msg || 'Failed to recommend post');
    }
  };

  return (
    <div className='post'>
      <div className='post-header'>
        <div className='post-user' style={{ cursor: 'pointer' }}>
          <img src={user?.profilePicture || '/default-profile.jpg'} className='p-img' alt={`${user?.username}'s profile picture`} />
          <h2>{user?.username}</h2>
          <p className='datePara'>{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <div className='delete'>
          {showDelete && (
            <div className="options">
              <button><PiSmileySad />Không quan tâm bài viết này</button>
              <button><IoVolumeMuteOutline />Tắt tiếng người dùng này</button>
              <button><MdBlockFlipped />Chặn người dùng này</button>
              {post.userId === parseInt(userId) && (
                <button onClick={handleDelete}><AiOutlineDelete />Xóa</button>
              )}
              <button><MdReportGmailerrorred />Báo cáo bài viết</button>
            </div>
          )}
          <MoreVertRoundedIcon className='post-vertical-icon' onClick={() => setShowDelete(!showDelete)} />
        </div>
      </div>
      <p className='body'>
        {post.content?.length <= 300
          ? post.content
          : `${post.content.slice(0, 300)}...`}
      </p>
      {post.image && (
        <img src={`http://localhost:5000${post.image}`} alt="Hình ảnh bài viết" className="post-img" />
      )}
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
            <span className='post-like'>{like} người thích,</span>
            <span className='post-comment'>{comments.length} bình luận</span>
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
                        placeholder='Thêm bình luận...'
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

export default PostUser;