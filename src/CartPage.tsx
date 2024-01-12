import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './Calculation.css';
import logoImage from './logo.png';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import full_basket from './full_basket.png';
import empty_basket from './empty_basket.png';
import axios from 'axios';

const CartPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [headerMessage, setHeaderMessage] = useState<string>('');
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<number | null>(null);
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleLogoutClick = () => {
    fetchApplicationId();
  };

  const fetchApplicationId = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/operations/');
      const applicationId = response.data.inserted_application_id;
      handleApplicationData(applicationId);
    } catch (error) {
      console.error('Error fetching application id:', error);
    }
  };

  const handleApplicationData = async (applicationId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/applications/${applicationId}/`);
      const applicationData = response.data;
      setCalculationDetails(applicationData.bouquet_details || []);
      console.log('Application Data:', applicationData);
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  const handleUpdateQuantity = async (applicationId: number, bouquetId: number, newQuantity: number) => {
    try {
      await axios.put(`http://localhost:8000/api/applications/${applicationId}/bouquets/${bouquetId}/`, {
        quantity: newQuantity,
      });
      // Обновим данные после успешного изменения количества
      fetchApplicationId();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      // Завершаем редактирование после обновления
      setEditingQuantityIndex(null);
    }
  };

  useEffect(() => {
    fetchApplicationId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const userData = await response.json();
        dispatch(setUsername(userData.username));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  const breadcrumbsItems = [{ label: 'Все операции', link: '' }];

  return (
    <div>
      <header>
        <a href="/operations">
          <img src={logoImage} alt="Логотип" className="logo" />
        </a>
        <h1>Удалённые вычисления</h1>
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
            <LogoutButton onLogout={handleLogoutClick} />
          </div>
        )}
      </header>

      <div className="container">
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} />
          <div className="card-container">
            {calculationDetails.map((detail, index) => (
              <div key={index} className="card">
                <img
                  src={
                    detail.bouquet.full_url !== '' &&
                    detail.bouquet.full_url !== 'http://localhost:9000/images/images/None'
                      ? detail.bouquet.full_url
                      : logoImage
                  }
                  alt={detail.bouquet.full_url}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{detail.bouquet.name}</h5>
                  <p className="card-text">Цена: {detail.bouquet.price || 'Цена не указана'} рублей</p>
                  {editingQuantityIndex === index ? (
                    <div>
                      <input
                        type="number"
                        value={detail.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          setBouquetDetails((prevDetails) => {
                            const newDetails = [...prevDetails];
                            newDetails[index].quantity = newQuantity;
                            return newDetails;
                          });
                        }}
                      />
                      <button
                        onClick={() =>
                          handleUpdateQuantity(applicationId, detail.bouquet.bouquet_id, detail.quantity)
                        }
                      >
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="card-text">Количество: {detail.quantity || 'Не указано'}</p>
                      <button onClick={() => setEditingQuantityIndex(index)}>Изменить количество</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;