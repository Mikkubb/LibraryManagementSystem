import React, { useEffect, useState } from 'react';
import { Table, Button, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/ColumnWidth.css';
import '../styles/Rentals.css';

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/rentals', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRentals(data);
        } else {
          console.error('Unexpected response format:', data);
          setRentals([]);
        }
      })
      .catch(error => {
        console.error('Error fetching rentals:', error);
        setRentals([]);
      });
  }, [token]);

  const handlePostpone = (rental) => {
    navigate(`/rentals/postpone/${rental._id}`, { state: { rental, returnUrl: '/rentals' } });
  };

  const handleReturn = async (rentalId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rentals/return/${rentalId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert('Book returned successfully');
        setRentals(rentals.filter(rental => rental._id !== rentalId));
      } else {
        alert('Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const filteredRentals = rentals.filter(rental =>
  !searchTerm || (rental.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
);

  return (
  <div className="container mt-3">
    <h1>ALL RENTALS</h1>
    <FormControl
      type="text"
      placeholder="Search by title..."
      className="mb-3"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Table striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>USER_ID</th>
          <th>USER_EMAIL</th>
          <th>BOOK_ID</th>
          <th>BOOK_TITLE</th>
          <th>DATE_OF_RENTAL</th>
          <th>DATE_TO_RETURN</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {filteredRentals.map(rental => {
          const isOverdue = rental.dateToReturn && new Date(rental.dateToReturn) < new Date();
          return (
            <tr key={rental._id} className={isOverdue ? 'overdue' : ''}>
              <td>{rental.user?.userId || 'ND'}</td>
              <td className="table-wrap">{rental.user?.email || 'ND'}</td>
              <td>{rental.book?.bookId || 'ND'}</td>
              <td className="table-wrap">{rental.book?.title || 'ND'}</td>
              <td>
                {rental.dateOfRental
                  ? new Date(rental.dateOfRental).toLocaleDateString()
                  : 'ND'}
              </td>
              <td>
                {rental.dateToReturn
                  ? new Date(rental.dateToReturn).toLocaleDateString()
                  : 'ND'}
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handlePostpone(rental)}
                  disabled={!rental.user || !rental.book}
                >
                  Postpone
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleReturn(rental._id)}
                  disabled={!rental.user || !rental.book}
                >
                  Return
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </div>
);
};

export default Rentals;
