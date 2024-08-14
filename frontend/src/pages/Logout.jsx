import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();

  useEffect(() => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem("auth");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div className='vh-100 d-flex justify-content-center flex-column align-items-center'>
      <h1 className='display-3'>Logout Successful!</h1>
      <p className='display-6'>You will be redirected to the landing page in 3 seconds...</p>
    </div>
  )
}

export default Logout