import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken, setUsername } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../Calculation.css';
import axios from 'axios';
import logoImage from '../logo.png'; 

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error message

  const closeError = () => {
    setError(null); // Clear error message
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/login/', {
        login,
        password,
      });

      const sessionKey = response.data.session_key;
      const username = response.data.username;
      dispatch(setAuthToken(sessionKey));
      dispatch(setUsername(username));

      // Check for status 200 and redirect
      if (response.status === 200) {
        navigate('/operations/');
      } else {
        // Handle other status codes
        console.error('Login unsuccessful. Status:', response.status);
        setError('Login unsuccessful. Please try again.'); // Set error message

        // Automatically clear the error after 5 seconds
        setTimeout(() => {
          closeError();
        }, 1000);
      }

    } catch (error) {
      console.error('Error during login:', error);
      setError('Неверный логин или пароль'); // Set error message

      // Automatically clear the error after 5 seconds
      setTimeout(() => {
        closeError();
      }, 1000);
    }
  };

  return (
    <div>
    <header>
    <a href="/operations">
      <img src={logoImage} alt="Логотип" className="logo" />
    </a>
    <h1>Удалённые вычисления</h1>
  </header>
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="Логин"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-primary" type="button" onClick={handleLogin}>
            Войти
          </button>
          <Link to="/register" className="btn btn-primary">
            Зарегистрироваться
          </Link>
        </div>
      </form>
      {error && (
        <div className="error-modal">
          <div className="modal-content">
            <span className="close" onClick={closeError}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default LoginPage;