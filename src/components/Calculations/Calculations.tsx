import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './Calculations.css';
import logoImage from './logo.png';
import { RootState } from '../../redux/store';
import LogoutButton from './LogoutButton';
import { setUsername } from '../../redux/authSlice';
import full_basket from './full_basket.png'
import empty_basket from './empty_basket.png'
import axios from 'axios';

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  full_url: string;
}

const CalculationsPage: FC = () => {
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
    // Call fetchBouquets when LogoutButton is clicked
    fetchCalculations(searchValue);
  };

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/api/operations/?title=${searchValue}`);
    fetchCalculations(searchValue);
  };

  const handleAddToCart = async (calculationId: number) => {
    try {
      await axios.post(`http://localhost:8000/api/operations/${calculationId}/add/`);
      fetchCalculations(searchValue);
    } catch (error) {
    }
  };

  const fetchCalculations = (searchText: string) => {
    // Fetch bouquet data using the relative path with query parameter
    fetch(`http://localhost:8000/api/operations/?title=${searchText}`) // op or calc
      .then(response => response.json())
      .then(data => {
      const calculationsData = data.calculations || [];
      
      console.log('Calculations fetched:', calculationsData);
      setCalculations(calculationsData);
      const insertedApplicationId = data.inserted_application_id;
      const newHeaderMessage = insertedApplicationId === null ? 'null' : 'не null';
      setHeaderMessage(newHeaderMessage);
      
      })
      .catch(error => {
        console.error('Error fetching calculations:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' } // Link to the current page
  ];

  useEffect(() => {
    // Fetch data when the component mounts for the first time or when search query changes
    fetchCalculations(searchValue);
  }, [searchValue]); // was []

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data'); // Replace with your actual API endpoint
        const userData = await response.json();
        dispatch(setUsername(userData.username));
      } catch (error) {
      }
    };

    // Fetch user data only if the user is logged in
    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);


  return (
    <div>
    <header>
      <a href="/bouquets">
        <img src={logoImage} alt="Логотип" className="logo" />
      </a>
      <h1>Petal Provisions</h1>
      {!isUserLoggedIn && (
        <div className="text-and-button">
          <img
            src={headerMessage === 'null' ? empty_basket : full_basket}
            alt="Basket Image"
            className="basket-image"
          />
          <button className="btn btn-primary" onClick={handleLoginClick}>
            Войти
          </button>
        </div>
      )}
      {isUserLoggedIn && (
        <div className="text-and-button">
            <img
            src={headerMessage === 'null' ? empty_basket : full_basket}
            alt="Basket Image"
            className="basket-image"
          />
          <p>{username}</p>
          <LogoutButton onLogout={handleLogoutClick} /> {/* Pass the callback function */}
        </div>
      )}
    </header>

    <div className="album">
      <div className="container">
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
          <div className="search-bar">
            <input
              type="text"
              id="search-input"
              placeholder="Поиск"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button type="button" id="search-button" onClick={handleSearchClick}>
              Искать
            </button>
          </div>

          {calculations.map((calculation) => (
            <div className="col" key={calculation.calculation_id}>
              <div className="card">
                <img
                  src={
                    calculation.full_url !== '' && calculation.full_url !== 'http://localhost:9000/images/images/None'
                      ? calculation.full_url
                      : logoImage
                  } // Use bouquet.full_url or default logoImage
                  alt={calculation.calculation_name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{calculation.calculation_name}</h5>
                  <p className="card-text">{calculation.calculation_description}</p>
                  {/* Add more text elements here if needed */}
                  <a href={`/operations/${calculation.calculation_id}/`} className="btn btn-primary">
                    Подробнее
                  </a>
                  <button onClick={() => handleAddToCart(calculation.calculation_id)} className="btn btn-primary">
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default CalculationsPage;