  import React, { useEffect, useState } from 'react';
  import axios from 'axios'; // أو استخدم الـ axiosInstance اللي عندك لو موجود
  import { useParams } from 'react-router-dom';
  import { useShareUrl } from '../context/ShareUrlContext';

  function ShareContracts() {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { shareUrl } = useShareUrl(); // استخدام الـ context
  console.log('shareUrl', shareUrl);

    // useEffect(() => {
    //   const fetchSharedContract = async () => {
    //     try {
    //       const response = await axios.get(`${shareUrl}`); 
          
    //       if (response.data.status === 'success') {
    //         setContract(response.data.data);
    //       } else {
    //         setError('Failed to load contract.');
    //       }
    //     } catch (err) {
    //       setError('An error occurred while fetching the contract.');
    //       console.error(err);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchSharedContract();
    // }, [id]);

    // if (loading) {
    //   return <div>Loading...</div>;
    // }

    // if (error) {
    //   return <div>{error}</div>;
    // }

    return (
      <>
      <p>shareUrl</p>
      </>
      // <div style={{ padding: '20px' }}>
      //   <h1>Contract Details</h1>
        
      //   <h2>{contract.title}</h2>
      //   <p><strong>Description:</strong> {contract.description}</p>
      //   <p><strong>Price:</strong> {contract.price} SAR</p>
      //   <p><strong>Down Payment:</strong> {contract.down_payment}%</p>
      //   <p><strong>Customer Name:</strong> {contract.customer_name}</p>
      //   <p><strong>Customer Phone:</strong> {contract.customer_phone}</p>
      //   <p><strong>Status:</strong> {contract.status}</p>

      //   <h3>Real Estate Info</h3>
      //   <p><strong>Title:</strong> {contract.real_estate.title}</p>
      //   <p><strong>Location:</strong> {contract.real_estate.location}</p>
      //   <p><strong>Area:</strong> {contract.real_estate.area || 'N/A'}</p>
        
      //   {/* يمكنك إضافة المزيد من الحقول حسب الحاجة */}
      // </div>
    );
  }

  export default ShareContracts;