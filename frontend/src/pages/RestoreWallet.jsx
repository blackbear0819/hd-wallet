import axios from 'axios';
import React, { useCallback } from 'react'
import { toast } from 'react-toastify';
import { baseUrl } from '../service/consts';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const seeds = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12]
];

const RestoreWallet = () => {
  const navigate = useNavigate();
  const restoreWallet = useCallback(async () => {
    const seedPhraseElems = document.getElementsByTagName('input');
    let tmps = [];
    for (let index = 0; index < seedPhraseElems.length; index++) {
      tmps.push(seedPhraseElems[index].value);
    }
    console.log(tmps.join(' '));
    try {
      const response = await axios.post(`${baseUrl}/restore`, { seedPhrase: tmps.join(' ') });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);
  return (
    <div className='d-flex justify-content-center align-items-center flex-column w-100 vh-100'>
      <h1 className='display-1'>RESTORE WALLET</h1>
      <Container>
        {seeds.map((items, key1) =>
          <Row key={key1}>
            {items.map((item, key2) => <Col key={key1 + '' + key2} sm>
              <input type="text" className='form-control mb-2'
                placeholder={item} />
            </Col>)}
          </Row>
        )}
      </Container>
      <div className='d-flex'>
        <button className="btn btn-dark me-1" onClick={restoreWallet}>Restore</button>
      </div>
    </div>
  )
}

export default RestoreWallet