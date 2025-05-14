import React from 'react';
import PostUser from './PostUser';

const FeedUser = ({ posts, setPosts, user }) => {
  return (
    <div className='feedposts'>
      {posts.map((post) => (
        <PostUser
          user={user}
          posts={posts}
          post={post}
          setPosts={setPosts}
          key={post.id}
        />
      ))}
    </div>
  );
};

export default FeedUser;