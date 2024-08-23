import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { baseUrl } from '../service/consts';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

const seeds = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12]
];

const RestoreWallet = () => {
  const navigate = useNavigate();
  const [seedPhrases, setSeedPhrases] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    axios.get(`${baseUrl}/seed-phrase`).then(res => {
      setSeedPhrases(res.data.seedPhrase.split(' '));
    }).catch(error => {
      console.log(error);
    });
  }, []);
  const restoreWallet = useCallback(async () => {
    const seedPhraseElems = document.getElementsByTagName('input');
    let tmps = [];
    for (let index = 0; index < seedPhraseElems.length; index++) {
      tmps.push(seedPhraseElems[index].value);
    }
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
    <Container>
      <div className='d-flex justify-content-center align-items-center flex-column w-100 vh-100'>
        {seedPhrases.length !== 0 && show &&
          <Alert variant="info" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Seed Phrase</Alert.Heading>
            <p>{seedPhrases.map((item, index) => <span className='me-3'>{`${index + 1}: ${item}`}</span>)}</p>
          </Alert>
        }
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
    </Container>
  )
}

export default RestoreWallet