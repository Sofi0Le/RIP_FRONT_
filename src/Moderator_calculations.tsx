import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
//import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './components/Calculations/Calculations.css';
import logoImage from './logo.png';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import axios from 'axios';

interface Calculation {
    calculation_id: number;
    calculation_name: string;
    calculation_description: string;
    full_url: string;
    calculation_status: string;
  }

const ModeratorOperationsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('title') || '';

  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [headerMessage, setHeaderMessage] = useState<string>('');

  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleLogoutClick = () => {
    fetchCalculations(searchValue);
  };

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/api/operations/?title=${searchValue}`);
    fetchCalculations(searchValue);
  };

  const handleDelete = async (calculationId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/operations/${calculationId}/delete/`);
      fetchCalculations(searchValue);
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const handleRestore = async (calculationId: number) => {
    try {
      await axios.put(`http://localhost:8000/api/operations/${calculationId}/edit/`, { calculation_status: 'Active' });
      fetchCalculations(searchValue);
    } catch (error) {
      console.error('Error restoring bouquet:', error);
    }
  };

  const fetchCalculations = async (searchText: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/operations/?title=${searchText}`, {
        withCredentials: true,
      });
      const data = response.data;
      setCalculations(data.calculations); //??????
      const insertedApplicationId = data.inserted_application_id;
      const newHeaderMessage = insertedApplicationId === null ? 'null' : 'не null';
      setHeaderMessage(newHeaderMessage);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user-data');
      const userData = response.data;
      dispatch(setUsername(userData.username));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchCalculations(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  return (
    <div>
      <header>
        <a href="/operations">
          <img src={logoImage} alt="Логотип" className="logo" />
        </a>
        <h1>Удалённые вычисления</h1>
        {!isUserLoggedIn && (
          <div className="text-and-button">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Войти
            </button>
          </div>
        )}
        {isUserLoggedIn && (
          <div className="text-and-button">
            <p>{username}</p>
            <LogoutButton onLogout={handleLogoutClick} />
          </div>
        )}
      </header>

      <div className="album">
        <div className="container">
          <div className="row">
            {/* Display bouquets in a table */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Картинка</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calculation) => (
                  <tr key={calculation.calculation_id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <img
                        src={
                            calculation.full_url !== '' && calculation.full_url !== 'http://localhost:9000/images/images/None'
                            ? calculation.full_url
                            : logoImage
                        }
                        alt={calculation.calculation_name}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{calculation.calculation_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {calculation.calculation_status === 'Active' ? 'Доступно' : 'Удалёно'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {calculation.calculation_status === 'in_stock' ? (
                          <button onClick={() => handleDelete(calculation.calculation_id)} className="btn btn-primary">
                            Удалить
                          </button>
                      ) : (
                        <button onClick={() => handleRestore(calculation.calculation_id)} className="btn btn-primary">
                          Сделать доступным
                        </button>
                      )}
                      <a href={`/moderator/operations/change/${calculation.calculation_id}/`} className="btn btn-primary">
                        Редактировать
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-and-button">
            <button className="btn btn-primary" onClick={() => navigateTo('/moderator/operations/new/')}>
              Добавить букет
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorOperationsPage