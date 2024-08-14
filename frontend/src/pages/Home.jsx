import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import { FaSortDown, FaPlus } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';
import { baseUrl } from '../service/consts';

const Home = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [show, setShow] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [accounts, setAccounts] = useState([]);

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);
  const handleCloseAccount = useCallback(() => setAccountShow(false), []);
  const handleShowAccount = useCallback(() => {
    setAccountShow(true);
    setIsCreateAccount(false);
  }, []);

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/accounts`);
      setAccounts(response.data.accounts);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }, []);

  const createAccount = useCallback(async () => {
    if (!account) {
      toast.warning('Account field is required!');
      return;
    }
    if (!privateKey) {
      toast.warning('Private key field is required!');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/account`, {
        account: account,
        privateKey: privateKey
      });
      toast.success(response.data.msg);
      setIsCreateAccount(false);
      loadAccounts();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }, [account, privateKey]);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container className='my-2'>
          <Navbar.Brand className='w-25'>
            <Button variant='dark' onClick={handleShow} className='d-flex'>
              <span>Ethereum Mainnet</span>
              <FaSortDown />
            </Button>
          </Navbar.Brand>
          <Navbar.Brand className='w-25'>
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
          <div className='w-25 d-flex justify-content-end me-5'>
            <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">More</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Notifications</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Account details</Dropdown.Item>
                <Dropdown.Item>View on explorer</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>All Permissions</Dropdown.Item>
                <Dropdown.Item>Snaps</Dropdown.Item>
                <Dropdown.Item>Support</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item href='/logout'><FaSignOutAlt /> Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>
      <Container>
        {!isLoading ?
          <h1 className='text-center my-5 display-3 text-secondary'>$123456789</h1>
          :
          <div className='d-flex align-items-center justify-content-center my-5'>
            <Spinner animation="border" role="status" variant='secondary'></Spinner>
            <h5 className='text-secondary m-2 display-6'>Calculating...</h5>
          </div>
        }
      </Container>

      {/* Ethereum Mainest Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select a network</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-column'>
            <Button variant='dark' className='mb-1'>Ethereum Mainnet</Button>
            <Button variant='dark'>Bitcoin Mainnet</Button>
          </div>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="dark" onClick={handleClose} className='d-flex align-items-center w-100 justify-content-center'>
            <FaPlus className='me-1' />
            <span>Add network</span>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Account Modal */}
      <Modal show={accountShow} onHide={handleCloseAccount}>
        <Modal.Header closeButton>
          <Modal.Title>{isCreateAccount ? 'Add account' : 'Select an account'}</Modal.Title>
        </Modal.Header>
        {isCreateAccount
          ? <Modal.Body>
            <p className='mb-0'>Account name</p>
            <input type="text" className='form-control' placeholder='Enter your new account.'
              onChange={e => setAccount(e.target.value)} />
            <p className='mb-0 mt-3'>Private key</p>
            <input type="text" className='form-control' placeholder='Enter your private key. ex: 0x12345abcdef67890...'
              onChange={e => setPrivateKey(e.target.value)} />
          </Modal.Body>
          : <>
            {accounts.map((item, index) =>
              <Modal.Body className='border-bottom' style={{ cursor: 'pointer' }} key={index}>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h5 className='mb-0'>{item.name}</h5>
                    <p className='mb-0 w-50 text-truncate'>{item.publicKey}</p>
                  </div>
                  <div>
                    <p className='text-end mb-0'>USD</p>
                    <p className='text-end mb-0'>2ETH</p>
                  </div>
                </div>
              </Modal.Body>)}
          </>
        }
        <Modal.Footer>
          {isCreateAccount ?
            <>
              <button className='btn btn-secondary' onClick={() => setIsCreateAccount(false)}>Cancel</button>
              <button className='btn btn-dark' onClick={createAccount}>Create</button>
            </> :
            <Button variant="dark" onClick={() => setIsCreateAccount(true)} className='d-flex align-items-center w-100 justify-content-center'>
              <FaPlus className='me-1' />
              <span>Add account or hardware wallet</span>
            </Button>}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Home