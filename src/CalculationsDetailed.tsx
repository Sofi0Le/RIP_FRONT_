import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './CalculationsDetailed.css';
import logoImage from './logo.png'; 

const CalculationsDetailedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Accessing the bouquet_id from the URL
  const [calculationData, setCalculationtData] = useState({
    calculation_name: '',
    calculation_description: '',
    full_url: ''
  });

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/calculations' },
    { label: 'Подробнее', link: '' } 
  ];


  useEffect(() => {
    const fetchCalculationData = async () => {
      try {
        const response = await fetch(`/operations/${id}`); // Assuming your API endpoint is like 'bouquets/id'
        const data = await response.json();
        setCalculationtData(data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching calculation data:', error);
      }
    };

    fetchCalculationData(); // Call the fetchBouquetData function when the component mounts

    // Cleanup the effect when the component is unmounted (optional)
    return () => {
      // Cleanup code (if needed)
    };
  }, [id]); // Dependency array ensures the effect runs whenever 'id' changes

  return (
    <div className="container">
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
          <div className="col">
            <div className="card">

            <img
                  src={(calculationData.full_url != '' && calculationData.full_url !== 'http://localhost:9000/images/images/None') ? calculationData.full_url : logoImage} // Use bouquet.full_url or default logoImage
                  alt={calculationData.full_url}
                  className="card-img-top"
                />
              <div className="card-body">
                <h5 className="card-title">{calculationData.calculation_name}</h5>
                <p className="card-text">{calculationData.calculation_description}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default CalculationsDetailedPage;