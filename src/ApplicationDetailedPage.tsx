import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios library
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './CalculationDetail.css';
import logoImage from './logo.png';

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  calculation_image_url: string;
  full_url: string;
  result: number;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  login: string;
  role: string;
}

interface Application {
  user: User;
  application_status: string;
  moderator: User;
  input_first_param: number;
  input_second_param: number;
}

interface ApplicationCalc {
    application: Application;
    calculation: { calculation: Calculation;}[];
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

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<ApplicationCalc | null>(null);
  const navigateTo = useNavigate();
  //const [editedQuantities, setEditedQuantities] = useState<{ [key: number]: number }>({});

  const [editedClientInfo, setEditedClientInfo] = useState({
    input_first_param: orderData?.application.input_first_param || '',
    input_second_param: orderData?.application.input_second_param || '',
  });

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/operations' },
    { label: 'Подробнее', link: '' }
  ];

    // Define fetchOrderData function
    const fetchOrderData = async () => {
        try {
            const orderResponse = await axios.get(`http://localhost:8000/api/applications/${id}/`, {
              withCredentials: true,
            });
          
            const orderData = orderResponse.data;
            setOrderData(orderData);
            console.log(orderData)
            setEditedClientInfo({
              input_first_param: orderData.application.input_first_param,
              input_second_param: orderData.application.input_second_param,
            });
          } catch (error) {
            console.error('Error fetching order data:', error);
          }
      };

  useEffect(() => {

    fetchOrderData();

    return () => {
      // Cleanup if needed
    };
  }, [id]);


  
  const handleSaveChanges = async () => {
    try {
        // Make a PUT request using Axios with credentials
        await axios.put(`http://localhost:8000/api/applications/${id}/change_inputs/`, {
          input_first_param: editedClientInfo.input_first_param,
          input_second_param: editedClientInfo.input_second_param,
        }, {
          withCredentials: true,
        });
      
        // Optionally, you can refetch the order data to update the displayed information
        fetchOrderData();
      } catch (error) {
        console.error('Error updating client information:', error);
      }
      
  };

  const handleConfirmOrder = async () => {
    try {
      // Make a PUT request using Axios with the withCredentials option
      await axios.put(`http://localhost:8000/api/applications/${id}/change_status/client/`, {
        application_status: 'In service',
      }, {
        withCredentials: true,
      });
    
      // Optionally, you can refetch the order data to update the displayed information
      fetchOrderData();
    } catch (error) {
      console.error('Error updating client information:', error);
    }
    };

    const handleDeleteOrder = async () => {
        try {
            // Make a DELETE request using Axios
            await axios.delete(`http://localhost:8000/api/applications/${id}/delete/`, {
              withCredentials: true,
            });
          
            // Optionally, you can refetch the order data to update the displayed information
            fetchOrderData();
            navigateTo('/operations/')
          } catch (error) {
            console.error('Error deleting application:', error);
          }
        };

  const handleDeleteBouquet = async (bouquetId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/applications_calculations/${id}/operations_delete/${bouquetId}/`,
      {
        withCredentials: true,
      });
      // Fetch updated order data after successful deletion
      fetchOrderData()
    } catch (error) {
      console.error('Error deleting bouquet:', error);
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
      <div className="container">
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} />
          <div className="col">
            {orderData && (
              <div className="order-details">
                {orderData.application.application_status !== 'Inserted' ? (
                  <>
                    <h2>Информация о заявке</h2>
                    <div className="status-info">
                      <p>
                        <b>Статус заявки:</b> {translateStatus(orderData.application.application_status) || 'Не указан'}
                      </p>
                    </div>
                    <div className="client-info">
                      <p>
                        <b>Первый параметр:</b> {orderData.application.input_first_param || 'Не указано'} | 
                        <b>  Второй параметр:</b> {orderData.application.input_second_param || 'Не указано'} | 
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Редактирование информации о заявке</h2>
                    <div className="client-info">
                      <label>
                        Первый параметр:
                        <input
                          type="text"
                          value={editedClientInfo.input_first_param}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, input_first_param: e.target.value })}
                        />
                      </label>
                      <label>
                        Второй параметр:
                        <input
                          type="text"
                          value={editedClientInfo.input_second_param}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, input_second_param: e.target.value })}
                        />
                      </label>
                      <button onClick={handleSaveChanges}>Сохранить изменения</button>
                      <button onClick={handleConfirmOrder}>Подтвердить заявку</button>
                      <button onClick={handleDeleteOrder}>Удалить заявку</button>
                    </div>
                  </>
                )}
                <h3>Информация о вычислительных операциях</h3>
                {orderData.calculation.map((detail, index) => (
                <div key={index} className="card">
                    <img
                    src={(detail.full_url !== '' && detail.full_url !== 'http://localhost:9000/pictures/None') ? detail.full_url : logoImage}
                    alt={detail.full_url}
                    className="card-img-top"
                    />
                    <div className="card-body">
                    <h5 className="card-title">{detail.calculation_name}</h5>
                    <p className="card-text">Название операции: {detail.calculation_name}</p>
                    <p className="card-text">Описание: {detail.calculation_description || 'Информация уточняется'}</p>
                    <p className="card-text">Результат вычисления: {detail.result || ''}</p>

                    {orderData.application.application_status === 'Inserted' && (
                        <div>
                        <button onClick={() => handleDeleteBouquet(detail.calculation_id)}>
                            <span role="img" aria-label="Delete">❌</span> Удалить операцию
                        </button>
                        </div>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;