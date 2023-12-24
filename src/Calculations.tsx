import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './Calculations.css';
import logoImage from './logo.png'; 

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  full_url: string;
}

const CalculationsPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('title') || '';
  

  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);

  const fetchCalculations = (searchText: string) => {
    // Fetch bouquet data using the relative path with query parameter
    fetch(`/operations/?title=${searchText}`) // op or calc
      .then(response => response.json())
      .then(data => {
      const calculationsData = data.calculations || [];
      
      console.log('Calculations fetched:', calculationsData);
      setCalculations(calculationsData);
      
      })
      .catch(error => {
        console.error('Error fetching calculations:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' } // Link to the current page
  ];

  const handleSearchClick = () => {
    // Redirect to the same frontend page with the search query parameter
    navigateTo(`/calculations/?title=${searchValue}`);
    // Fetch data after navigating to the new URL
    fetchCalculations(searchValue);
  };

  useEffect(() => {
    // Fetch data when the component mounts for the first time or when search query changes
    fetchCalculations(searchValue);
  }, []); // Update the effect to run whenever searchValue changes

  return (
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
                onChange={(event => setSearchValue(event.target.value))}
              />
              <button type="button" id="search-button" onClick={handleSearchClick}>
                Искать
              </button>
            </div>

            {calculations.map((calculation) => (
            <div className="col" key={calculation.calculation_id}>
              <div className="card">
              <img
                  src={(calculation.full_url != '' && calculation.full_url !== 'http://localhost:9000/images/images/None') ? calculation.full_url : logoImage} // Use bouquet.full_url or default logoImage
                  alt={calculation.calculation_name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{calculation.calculation_name}</h5>
                  <p className="card-text">{calculation.calculation_description}</p>
                  {/* Add more text elements here if needed */}
                  <a href={`/calculations/${calculation.calculation_id}/`} className="btn btn-primary">
                    Подробнее
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculationsPage;