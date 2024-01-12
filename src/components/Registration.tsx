import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/authSlice';
import '../Calculation.css'; // Предполагается, что это ваш файл CSS
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import logoImage from '../logo.png'; 

const RegistrationPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirst] = useState('');
  const [last_name, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleOperationsClick = () => {
    navigateTo('/operations/');
  };

  const breadcrumbsItems = [
    { label: 'Авторизация', link: '/login' },
    { label: 'Регистрация', link: '' } 
  ];

  const handleLogin = async () => {
    setRole('User');
    try {
      const response = await axios.post('http://localhost:8000/api/users/registration/', {
        first_name,
        last_name, 
        email,
        login,
        password,
        role,
      });

      // Обработка Set-Cookie заголовка
      const sessionKey = response.data.session_key;
      dispatch(setAuthToken(sessionKey));
      // Дополнительные действия после успешной аутентификации
      navigateTo('/login/');
    } catch (error) {
      // Обработка ошибок, например, вывод сообщения об ошибке
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
    <header>
    <a href="/operations">
      <img src={logoImage} alt="Логотип" className="logo" />
    </a>
    <h1>Удалённые вычисления</h1>
    <div className="text-and-button">
          <button className="btn btn-primary" onClick={handleOperationsClick}>
            Операции
          </button>
        </div>
  </header>
  <div className="container">
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="Имя"
            type="text"
            value={first_name}
            onChange={(e) => setFirst(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Фамилия"
            type="text"
            value={last_name}
            onChange={(e) => setLast(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Почта"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
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
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
    </div>
      }
    </div>
    </div>
  );
};

export default RegistrationPage;