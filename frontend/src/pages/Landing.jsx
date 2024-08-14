import React from 'react'
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUser } from 'react-icons/fa'

const Landing = () => {
  return (
    <div className='d-flex justify-content-center align-items-center flex-column w-100 vh-100'>
      <h1 className='display-1'>HD WALLET</h1>
      <Link to="/login" className="btn btn-dark w-25 py-3 mb-1"><FaSignInAlt /> Login</Link>
      <Link to="/register" className="btn btn-dark w-25 py-3"><FaUser /> Register</Link>
    </div>
  )
}

export default Landing