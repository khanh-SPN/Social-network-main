import React, { useState, useContext } from 'react';
import { FiMail } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import '../RegisterPage/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { AuthContext } from '../../index';
import validation from './Validation';

const Login = () => {
  const { setIsAuthenticated, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const newObj = { ...data, [e.target.name]: e.target.value };
    setData(newObj);
    setError(validation({ ...newObj, username: 'dummy', confirmpassword: newObj.password }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const validationErrors = validation({ ...data, username: 'dummy', confirmpassword: data.password });
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await login(data);
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
      setError({ general: error.response?.data?.msg || error.message || 'Đăng nhập thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="container-form">
        <form onSubmit={handleSignIn}>
          <h1>Đăng nhập</h1>
          <p>Vui lòng đăng nhập để tiếp tục.</p>

          {error.general && <span style={{ color: 'red', display: 'block', marginBottom: '10px' }}>{error.general}</span>}

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

          <div className='divBtn'>
            <small className='FG'>Quên mật khẩu?</small>
            <button type='submit' className='loginBtn' disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
          </div>
        </form>

        <div className='dont'>
          <p>Chưa có tài khoản? <Link to="/signup"><span>Đăng ký</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;