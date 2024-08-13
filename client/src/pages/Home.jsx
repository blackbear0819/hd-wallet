import React, { useEffect, useState } from 'react'
// import "../styles/Home.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import axios from 'axios';
// import { baseUrl } from '../service/consts';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { FaSortDown, FaPlus } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa"
import Spinner from 'react-bootstrap/Spinner';


const Home = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  // const [ data, setData ] = useState({});
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [accountShow, setAccountShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseAccount = () => setAccountShow(false);
  const handleShowAccount = () => setAccountShow(true);

  // const fetchLuckyNumber = async () => {

  //   let axiosConfig = {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //   }
  //   };

  //   try {
  //     const response = await axios.get(`${baseUrl}/dashboard`, axiosConfig);
  //     setData({ msg: response.data.msg, luckyNumber: response.data.secret });
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // }



  useEffect(() => {
    // fetchLuckyNumber();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container className='my-2'>
          <Navbar.Brand>
            <Button variant='dark' onClick={handleShow} className='d-flex'>
              <span>Ethereum Mainest</span>
              <FaSortDown />
            </Button>
          </Navbar.Brand>
          <Navbar.Brand>
            <div className='d-flex flex-column'>
              <div className='d-flex justify-content-center'>
                <Button variant='dark' onClick={handleShowAccount} className='d-flex'>
                  <span>Account</span>
                  <FaSortDown />
                </Button>
              </div>
              {/* <p className='mb-0'>0xe8889...62BA2</p> */}
            </div>
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <NavDropdown title="More" id="basic-nav-dropdown">
                  <NavDropdown.Item>Notifications</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Account details</NavDropdown.Item>
                  <NavDropdown.Item>View on explorer</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>All Permissions</NavDropdown.Item>
                  <NavDropdown.Item>Snaps</NavDropdown.Item>
                  <NavDropdown.Item>Support</NavDropdown.Item>
                  <NavDropdown.Item>Settings</NavDropdown.Item>
                  <NavDropdown.Item href='/logout'><FaSignOutAlt /> Log out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      <Container>
        <h1 className='text-center my-5 display-3 text-secondary'>$123456789</h1>
        <div className='d-flex align-items-center justify-content-center'>
          <Spinner animation="border" role="status" variant='secondary'></Spinner>
          <h5 className='text-secondary m-2 display-6'>Calculating...</h5>
        </div>
      </Container>

      {/* Ethereum Mainest Modal */}
      <Modal show={show} onHide={handleClose} size='sm'>
        <Modal.Header closeButton>
          <Modal.Title>Select a network</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant='link' className='text-decoration-none text-dark'>Ethereum Mainnet</Button>
          <Button variant='link' className='text-decoration-none text-dark'>Linea Mainnet</Button>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="dark" onClick={handleClose} className='d-flex align-items-center'>
            <FaPlus className='me-1' />
            <span>Add network</span>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Account Modal */}
      <Modal show={accountShow} onHide={handleCloseAccount} size='sm'>
        <Modal.Header closeButton>
          <Modal.Title>Select an account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant='link' className='text-decoration-none text-dark'>Account1</Button>
          {/* <Button variant='link' className='text-decoration-none text-dark'>Linea Mainnet</Button> */}
        </Modal.Body>
        <Modal.Footer className='px-0 d-flex justify-content-center'>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="dark" onClick={handleCloseAccount} className='d-flex align-items-center'>
            <FaPlus />
            <span className='small'>Add account or hardware wallet</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    // <div className='dashboard-main'>
    //   <h1>Dashboard</h1>
    //   {/* <p>Hi { data.msg }! { data.luckyNumber }</p> */}
    //   <Link to="/logout" className="logout-button">Logout</Link>
    // </div>
  )
}

export default Home