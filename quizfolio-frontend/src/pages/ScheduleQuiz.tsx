import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button, Form, Table, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';

const SendEmail = () => {
  const { token } = useContext(AuthContext);
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/users/all', {
          headers: { 'x-auth-token': token },
        });
        setUsers(response.data);
      } catch (error) {
        setStatus({ type: 'danger', text: 'Error fetching users.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0) {
      setStatus({ type: 'warning', text: 'Please select at least one user.' });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/email/send-email',
        { userIds: selectedUsers, subject, message },
        { headers: { 'x-auth-token': token } }
      );
      setStatus({ type: 'success', text: response.data.msg });
    } catch (error) {
      setStatus({ type: 'danger', text: 'Error sending emails.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Send Email</IonTitle>
      </IonToolbar>
    </IonHeader>

    <Container fluid className="my-5 p-4 rounded shadow bg-light">
      <Row className="mb-3">
        <Col xs={12} md={6} className="text-start">
          <Button
            variant="link"
            className="text-primary d-flex align-items-center"
            onClick={() => history.push('/teacher')}
          >
            <FaArrowLeft className="me-2" /> Back to Teacher
          </Button>
        </Col>
      </Row>

      <Row className="text-center">
        <h3><FaEnvelope /> Send Email</h3>
      </Row>

      {status && (
        <Row>
          <Col>
            <Alert variant={status.type} onClose={() => setStatus(null)} dismissible>
              {status.text}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formSubject" className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <h5 className="mt-4 text-center">Select Users:</h5>
          {loading ? (
            <Spinner animation="border" className="my-3 d-block mx-auto" />
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-2">
              <Table responsive="sm" hover className="text-center">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th><FaUserCheck /> Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleUserSelection(user._id)}
                          checked={selectedUsers.includes(user._id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>

      <Row className="d-flex justify-content-center mt-4">
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handleSendEmail}
            disabled={loading}
            className="me-2 mb-2"
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={() => setStatus(null)}
            className="mb-2"
          >
            Clear Message
          </Button>
        </Col>
      </Row>
    </Container>
    </IonPage>
  );
};

export default SendEmail;
