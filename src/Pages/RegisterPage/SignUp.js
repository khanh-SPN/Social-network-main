import React, { useState } from 'react';
import '../RegisterPage/RegisterPage.css';
import { AiOutlineUser } from 'react-icons/ai';
import { FiMail } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api';

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
    profileTag: '', // Thêm profileTag để khớp với API
  });

  const handleChange = (e) => {
    const newObj = { ...data, [e.target.name]: e.target.value };
    setData(newObj);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
        profileTag: data.profileTag,
      };
      const { data: responseData } = await signup(signupData);
      localStorage.setItem('token', responseData.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <div className="container-form">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <p>Please fill the input below here.</p>

          {error && <span style={{ color: 'red', display: 'block', marginBottom: '10px' }}>{error}</span>}

          <div className="inputBox">
            <AiOutlineUser className='fullName' />
            <input
              type='text'
              name="username"
              id="username"
              onChange={handleChange}
              placeholder='Full Name'
            />
          </div>

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

          <div className="inputBox">
            <RiLockPasswordLine className='password' />
            <input
              type="password"
              name="confirmpassword"
              id="confirmPassword"
              onChange={handleChange}
              placeholder='Confirm Password'
            />
          </div>

          <div className="inputBox">
            <AiOutlineUser className='fullName' />
            <input
              type='text'
              name="profileTag"
              id="profileTag"
              onChange={handleChange}
              placeholder='Profile Tag (e.g., @username)'
            />
          </div>

          <div className='divBtn'>
            <small className='FG'>Forgot Password?</small>
            <button className='loginBtn'>SIGN UP</button>
          </div>
        </form>

        <div className='dont'>
          <p>Already have an account? <Link to="/"><span>Sign in</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;