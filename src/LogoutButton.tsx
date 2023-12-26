import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './redux/authSlice';

interface LogoutButtonProps {
  onLogout: () => void; // Define a callback function type
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Вызываем clearAuthToken, чтобы удалить токен из Redux и кук
    dispatch(logoutUser());

    // Call the callback function provided by the parent
    // Add a timeout before redirecting to "/bouquetss"
    setTimeout(() => {
      // Redirect to the "/bouquetss" route after logging out
      navigate('/operations');
      onLogout();

    }, 70); // 100 milliseconds (0.1 seconds) timeout
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Выйти
    </button>
  );
};

export default LogoutButton;