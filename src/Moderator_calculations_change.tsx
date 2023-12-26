// ModeratorBouquetsChangePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
//import Breadcrumbs from './Breadcrumbs';
import './Moderator_calculations_change.css'; // Import the CSS file
import logoImage from './logo.png';

const ModeratorCalculationsChangePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [calculationData, setCalculationData] = useState({
    calculation_name: '',
    calculation_description: '',
    full_url: '',
  });

  const [editedData, setEditedData] = useState({
    calculation_name: '',
    calculation_description: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquetss' },
    { label: 'Подробнее', link: '' },
  ];*/

  useEffect(() => {
    const fetchCalculationData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/operations/${id}/`);
        const data = await response.json();
        setCalculationData(data);
        setEditedData(data);
      } catch (error) {
        console.error('Error fetching calculation data:', error);
      }
    };

    fetchCalculationData();

    return () => {
      // Cleanup code (if needed)
    };
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Upload photo
      const formData = new FormData();
      formData.append('key', 'photo');
      formData.append('photo', selectedFile as Blob);

      // You may want to handle this upload endpoint on your server side

      /*const uploadResponse = await fetch('http://localhost:8000/api/upload_photo/', {
        method: 'POST',
        body: formData,
      });*/

      const uploadResponse = await fetch(`http://localhost:8000/api/operations/${id}/edit_im/`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);

      // Update bouquet data including image_url
      const updatedDataToSend = {
        ...editedData,
        image_url: uploadData.photo_url, // Assuming the response includes the photo_url field
      };

      const response = await fetch(`http://localhost:8000/api/operations/${id}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDataToSend),
      });

      const updatedData = await response.json();
      setCalculationData(updatedData);
    } catch (error) {
      console.error('Error updating bouquet data:', error);
    }
  };

  return (
    <div>
      <header>
        <a href="/operations">
          <img src={logoImage} alt="Логотип" className="logo" />
        </a>
        <h1>Petal Provisions</h1>
      </header>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <img
                src={
                  calculationData.full_url !== '' && calculationData.full_url !== 'http://localhost:9000/images/images/None'
                    ? calculationData.full_url
                    : logoImage
                }
                alt={calculationData.full_url}
                className="card-img-top"
              />
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      value={editedData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Описание
                    </label>
                    <textarea
                      className="form-control form-control-dis"
                      id="description"
                      name="description"
                      value={editedData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                      Обновить фото
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={openFileInput}
                      >
                        Выберите файл
                      </button>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                    Сохранить изменения
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorCalculationsChangePage;