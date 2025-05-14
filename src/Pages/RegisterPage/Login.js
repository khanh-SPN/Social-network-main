import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import '../RegisterPage/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const newObj = { ...data, [e.target.name]: e.target.value };
    setData(newObj);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data: responseData } = await login(data);
      localStorage.setItem('token', responseData.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="container-form">
        <form onSubmit={handleSignUp}>
          <h1>Login</h1>
          <p>Please sign in to continue.</p>

          {error && <span style={{ color: 'red', display: 'block', marginBottom: '10px' }}>{error}</span>}

          <div className="inputBox">
            <FiMail className='mail' />
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              placeholder='Email'
            />
          </div>

          <div className="inputBox">
            <RiLockPasswordLine className='password' />
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              placeholder='Password'
            />
          </div>

          <div className='divBtn'>
            <small className='FG'>Forgot Password?</small>
            <button type='submit' className='loginBtn'>LOGIN</button>
          </div>
        </form>

        <div className='dont'>
          <p>Don't have an account? <Link to="/signup"><span>Sign up</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;