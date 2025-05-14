import React, { useState, useContext } from 'react';
import '../RegisterPage/RegisterPage.css';
import { AiOutlineUser } from 'react-icons/ai';
import { FiMail } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api';
import { AuthContext } from '../../index';
import validation from './Validation';

const SignUp = () => {
  const { setIsAuthenticated, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
    profileTag: '',
  });

  const handleChange = (e) => {
    const newObj = { ...data, [e.target.name]: e.target.value };
    setData(newObj);
    setError(validation(newObj));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationErrors = validation(data);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
        profileTag: data.profileTag,
      };
      const response = await signup(signupData);
      const { token, userId } = response; // BE trả { token, userId }
      if (!userId) {
        throw new Error('Không nhận được userId từ server');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      setUserId(userId);
      navigate('/home');
    } catch (error) {
      setError({ general: error.response?.data?.msg || error.message || 'Đăng ký thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="container-form">
        <form onSubmit={handleSignUp}>
          <h1>Tạo tài khoản</h1>
          <p>Vui lòng điền thông tin bên dưới.</p>

          {error.general && <span style={{ color: 'red', display: 'block', marginBottom: '10px' }}>{error.general}</span>}

          <div className="inputBox">
            <AiOutlineUser className='fullName' />
            <input
              type='text'
              name="username"
              id="username"
              onChange={handleChange}
              value={data.username}
              placeholder='Tên người dùng'
            />
            {error.username && <span style={{ color: 'red', fontSize: '12px' }}>{error.username}</span>}
          </div>

          <div className="inputBox">
            <FiMail className='mail' />
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={data.email}
              placeholder='Email'
            />
            {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
          </div>

          <div className="inputBox">
            <RiLockPasswordLine className='password' />
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={data.password}
              placeholder='Mật khẩu'
            />
            {error.password && <span style={{ color: 'red', fontSize: '12px' }}>{error.password}</span>}
          </div>

          <div className="inputBox">
            <RiLockPasswordLine className='password' />
            <input
              type="password"
              name="confirmpassword"
              id="confirmPassword"
              onChange={handleChange}
              value={data.confirmpassword}
              placeholder='Xác nhận mật khẩu'
            />
            {error.confirmpassword && <span style={{ color: 'red', fontSize: '12px' }}>{error.confirmpassword}</span>}
          </div>

          <div className="inputBox">
            <AiOutlineUser className='fullName' />
            <input
              type='text'
              name="profileTag"
              id="profileTag"
              onChange={handleChange}
              value={data.profileTag}
              placeholder='Thẻ hồ sơ (ví dụ: @username)'
            />
            {error.profileTag && <span style={{ color: 'red', fontSize: '12px' }}>{error.profileTag}</span>}
          </div>

          <div className='divBtn'>
            <small className='FG'>Quên mật khẩu?</small>
            <button className='loginBtn' disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
            </button>
          </div>
        </form>

        <div className='dont'>
          <p>Đã có tài khoản? <Link to="/"><span>Đăng nhập</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;