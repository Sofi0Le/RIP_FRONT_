import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/authSlice';
import '../Bouquet.css'; // Предполагается, что это ваш файл CSS
import axios from 'axios';

const RegistrationPage: React.FC = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/users/login/', {
        login,
        password,
      });

      // Обработка Set-Cookie заголовка
      const sessionKey = response.data.session_key;
      dispatch(setAuthToken(sessionKey));
      // Дополнительные действия после успешной аутентификации
    } catch (error) {
      // Обработка ошибок, например, вывод сообщения об ошибке
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="Имя"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Телефон"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Email"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
  );
};

export default RegistrationPage;