import { useState, useEffect } from 'react';
import '../Home/Home.css';
import Left from '../../Components/LeftSide/Left';
import Middle from '../../Components/MiddleSide/Middle';
import Right from '../../Components/RightSide/Right';
import Nav from '../../Components/Navigation/Nav';
import { getPosts } from '../../api';

const Home = ({ setFriendsProfile }) => {
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState('');
  const [images, setImages] = useState(null);
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts(page);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load posts');
      }
    };
    fetchPosts();
  }, [page]);

  const handlePostCreated = async () => {
    try {
      const { data } = await getPosts(page);
      setPosts(data.posts);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load posts');
    }
  };

  return (
    <div className='interface'>
      <Nav
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <div className="home">
        <Left />
        <Middle
          body={body}
          setBody={setBody}
          posts={posts}
          setPosts={setPosts}
          search={search}
          setFriendsProfile={setFriendsProfile}
          images={images}
          setImages={setImages}
          onPostCreated={handlePostCreated}
          error={error}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
        <Right
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          following={following}
          setFollowing={setFollowing}
        />
      </div>
    </div>
  );
};

export default Home;