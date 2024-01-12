// ModeratorBouquetsPage.tsx
import React, { FC, useState, useEffect } from 'react';
import './ApplicationsPage.css'
import { useNavigate } from 'react-router-dom';
import logoImage from './logo.png';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';
import { setUserrole, setUsername } from './redux/authSlice';

const formatDate = (dateString: string) => {
    if (!dateString) {
        return ''; // Return an empty string if the date string is empty
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru', options).format(date);
  };

interface Application {
  application_id: number;
  moderator: {
    login: string;
  } | null;
  user: {
    login: string;
  } | null;
  date_application_create: string;
  date_application_accept: string;
  date_application_complete: string;
  input_first_param: number;
  input_second_param: number;
  application_status: string;
  count_empty_results: number;
}

function translateStatus(status: string): string {
    switch (status) {
      case 'Deleted':
        return 'Удалено';
      case 'Finished':
        return 'Завершено';
      case 'In service':
        return 'Сформировано';
      case 'Inserted':
        return 'Введено';
      case 'Cancelled':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  }



const ApplicationsPage: FC = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status') || '';
  const startParam = queryParams.get('start_date') || '';
  const endParam = queryParams.get('end_date') || '';
  const isUserLoggedIn = document.cookie.includes('session_key');
  const role = useSelector((state: RootState) => state.auth.userrole);
  const username = useSelector((state: RootState) => state.auth.username);

  const [statusValue, setStatusValue] = useState(statusParam);
  const [startValue, setStartValue] = useState(startParam);
  const [endValue, setEndValue] = useState(endParam);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const [searchValue, setSearchValue] = useState('');

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/api/applications/?status=${statusValue}&start_date=${startValue}&end_date=${endValue}`);
    fetchApplications(statusValue, startValue, endValue);
  };

  const handleAccept = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/applications/${applicationId}/change_status/moderator/`,
        { application_status: 'Finished' },
        { withCredentials: true }  // Include this option for sending credentials (cookies)
      );
    
      // Handle success (you can update state, show a notification, etc.)
      console.log('Application finished successfully:', response.data);
    
      // Optionally, you can refetch the applications to update the UI
      fetchApplications(statusValue, startValue, endValue);
    } catch (error) {
      console.error('Error while finishing application:', error);
    }
    
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data'); // Replace with your actual API endpoint
        const userData = await response.json();
        dispatch(setUserrole(userData.role));
      } catch (error) {
      }
    };

    // Fetch user data only if the user is logged in
    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  const handleReject = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/applications/${applicationId}/change_status/moderator/`,
        { application_status: 'Cancelled' },
        { withCredentials: true }  // Add this option to include credentials
      );
    
      // Handle success (you can update state, show a notification, etc.)
      console.log('Application rejected successfully:', response.data);
    
      // Optionally, you can refetch the applications to update the UI
      fetchApplications(statusValue, startValue, endValue);
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
    
  };

  const handleLogoutClick = () => {
    navigateTo('/operations/');
  };

  /*const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/api/applications/?status=${statusValue}&start_date=${startValue}&end_date=${endValue}`);
    fetchApplications(statusValue, startValue, endValue);
  };*/


  const navigateTo = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async (statusValue:string, startValue:string, endValue:string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/applications/?status=${statusValue}&start_date=${startValue}&end_date=${endValue}`, { withCredentials: true });
      const data = response.data;

      // Filter applications on the frontend based on the searchValue (client login)
      const filteredApplications = data.filter(application =>
        application.user?.login.toLowerCase().includes(searchValue.toLowerCase())
      );

      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        //const response = await fetch('/api/user-data'); // Replace with your actual API endpoint
        //const userData = await response.json();
        const user_name = localStorage.getItem('username');
        dispatch(setUsername(user_name || ''));
        const user_role = localStorage.getItem('userrole');
        dispatch(setUserrole(user_role || ''));
      } catch (error) {
      }
    };

    // Fetch user data only if the user is logged in
    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  useEffect(() => {
    fetchApplications(statusValue, startValue, endValue);
  }, [statusValue, startValue, endValue, searchValue]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchApplications(statusValue, startValue, endValue);
    }, 2000); // 10 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [statusValue, startValue, endValue, searchValue]);

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
      {role === 'Moderator' && (
        <div className="search-bar" style={{ marginTop: '80px' }}>
          <input
            type="text"
            id="search-input"
            placeholder="Статус"
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value)}
          />
          <input
            type="date"
            id="search-input"
            placeholder="Начальная дата"
            value={startValue}
            onChange={(event) => setStartValue(event.target.value)}
          />
          <input
            type="date"
            id="search-input"
            placeholder="Конечная дата"
            value={endValue}
            onChange={(event) => setEndValue(event.target.value)}
          />
          <input
            type="text"
            id="search-input"
            placeholder="Поиск по клиенту"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <button type="button" id="search-button" onClick={handleSearchClick}>
            Искать
          </button>
        </div>
      )}
            <div className="album">
        <div className="container">
          <div className="row">
            <table className="table" style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  {/* Common columns for both roles */}
                  <th scope="col">Дата, время создания</th>
                  <th scope="col">Дата, время расчёта</th>
                  <th scope="col">Дата, время завершения</th>
                  <th scope="col">Первый параметр</th>
                  <th scope="col">Второй параметр</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Кол-во результатов</th>

                  {/* Role-specific columns */}
                  {role === 'Moderator' && (
                    <>
                      <th scope="col">Модератор</th>
                      <th scope="col">Клиент</th>
                    </>
                  )}
                  <th scope="col">Действия</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application, index) => (
                  <React.Fragment key={application.application_id}>
                    <tr 
                    className={`table-row ${index === hoveredRow ? 'hovered' : ''}`}
                    onMouseOver={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Common cells for both roles */}
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_create)}</td>
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_accept)}</td>
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_complete)}</td>
                      <td style={{ padding: '8px' }}>{application.input_first_param.toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{application.input_second_param.toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{translateStatus(application.application_status)}</td>
                      <td style={{ padding: '8px' }}>{application.count_empty_results}</td>

                      {/* Role-specific cells */}
                      {role === 'Moderator' && (
                        <>
                          <td style={{ padding: '8px' }}>{application.moderator?.login || 'Неизвестно'}</td>
                          <td style={{ padding: '8px' }}>{application.user?.login || 'Неизвестно'}</td>
                          <td style={{ padding: '8px' }}>
                            {application.application_status === 'In service' && (
                              <div>
                                <button onClick={() => handleAccept(application.application_id)} className="btn btn-primary">
                                  Принять
                                </button>
                                <button onClick={() => handleReject(application.application_id)} className="btn btn-primary">
                                  Отклонить
                                </button>
                              </div>
                            )}
                            <a href={`/applications/${application.application_id}/`} className="btn btn-primary">
                              Подробнее
                            </a>
                          </td>
                        </>
                      )}
                      {role === 'User' && (
                        <>
                        <td style={{ padding: '8px' }}>
                            <a href={`/applications/${application.application_id}/`} className="btn btn-primary">
                              Подробнее
                            </a>
                          </td>
                        </>
                      )}
                    </tr>
                    {index !== applications.length - 1 && <tr className="table-divider"></tr>}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;