import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './Calculation.css';
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

const ModeratorCalculationsPage: FC = () => {
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

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' } // Link to the current page
  ];

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/api/operations/?title=${searchValue}`);
    fetchCalculations(searchValue);
  };

  const handleDelete = async (calculationId: number) => {
    try {
      await axios(`http://localhost:8000/api/operations/${calculationId}/delete/`,
      {
        method: 'DELETE',
        withCredentials: true
      });
      fetchCalculations(searchValue);
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const handleRestore = async (calculationId: number) => {
    try {
      await axios.put(`http://localhost:8000/api/operations/${calculationId}/edit/`, {
        calculation_status: 'Active'
      }, {
        withCredentials: true // Include credentials in the request
      });
      fetchCalculations(searchValue);
    } catch (error) {
      console.error('Error restoring calculation:', error);
    }
    
  };

  const fetchCalculations = async (searchText: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/operations/?title=${searchText}&status=all`, {
        withCredentials: true,
      });
      const data = response.data;
      setCalculations(data.calculations);
      const draftApplicationId = data.inserted_application_id;
      const newHeaderMessage = draftApplicationId === null ? 'null' : 'не null';
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
             <span
            className="basket-text" // You can apply a class for styling if needed
            onClick={() => {
                navigateTo('/applications/');
              }}
            >
            <p>Заявки</p>
            </span>
            <p>{username}</p>
            <LogoutButton onLogout={handleLogoutClick} />
          </div>
        )}
      </header>

      <div className="album">
      <div className="container" style={{ marginTop: '20px' }}>
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
        <div className="container">
          <div className="row">
            {/* Display bouquets in a table */}
            <table className="table" style={{ marginTop: '0px' }}>
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
                    <td style={{  padding: '8px' }}>
                      <img
                        src={
                          calculation.full_url !== '' && calculation.full_url !== 'http://localhost:9000/pictures/None'
                            ? calculation.full_url
                            : logoImage
                        }
                        alt={calculation.calculation_name}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td style={{  padding: '8px' }}>{calculation.calculation_name}</td>
                    <td style={{ padding: '8px' }}>
                      {calculation.calculation_status === 'Active' ? 'Доступно' : 'Удалёно'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {calculation.calculation_status === 'Active' ? (
                          <button onClick={() => handleDelete(calculation.calculation_id)} className="btn btn-primary">
                            Удалить
                          </button>
                      ) : (
                        <button onClick={() => handleRestore(calculation.calculation_id)} className="btn btn-primary">
                          Активировать
                        </button>
                      )}
                     {calculation.calculation_status === 'Active' && (
                        <a href={`/moderator/operations/change/${calculation.calculation_id}/`} className="btn btn-primary">
                          Редактировать
                        </a>
                      )}
                      {calculation.calculation_status !== 'Active' && (
                        <a className="btn btn-second">
                          Редактировать
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-and-button">
            <button className="btn btn-add" onClick={() => navigateTo('/moderator/operations/new/')}>
              Добавить вычислительную операцию
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorCalculationsPage