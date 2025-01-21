import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import '../styles/ColumnWidth.css';
import '../styles/Rentals.css';

const UserRentals = () => {
  const [rentals, setRentals] = useState([]);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user')) || { userId: 'ND', email: 'ND' };

  useEffect(() => {
    if (currentUser.userId === 'ND') {
      console.error('User ID not found in localStorage');
      return;
    }

    fetch(`http://localhost:3001/api/rentals/user/${currentUser.userId}`, {
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
        console.error('Error fetching user rentals:', error);
        setRentals([]);
      });
  }, [token, currentUser.userId]);

  const isOverdue = (dateToReturn) => {
    const today = new Date();
    return dateToReturn && new Date(dateToReturn) < today;
  };

  return (
    <div className="container mt-3">
      <h1>YOUR RENTALS</h1>
      {rentals.length === 0 ? (
        <p>You have no rentals at the moment.</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>USER_ID</th>
              <th>USER_EMAIL</th>
              <th>BOOK_ID</th>
              <th>BOOK_TITLE</th>
              <th>DATE_OF_RENTAL</th>
              <th>DATE_TO_RETURN</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id} className={isOverdue(rental.dateToReturn) ? 'overdue' : ''}>
                <td>{currentUser.userId || 'ND'}</td>
                <td className="table-wrap">{currentUser.email || 'ND'}</td>
                <td>{rental.book?.bookId || 'ND'}</td>
                <td className="table-wrap">{rental.book?.title || 'ND'}</td>
                <td>{rental.dateOfRental ? new Date(rental.dateOfRental).toLocaleDateString() : 'ND'}</td>
                <td>{rental.dateToReturn ? new Date(rental.dateToReturn).toLocaleDateString() : 'ND'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserRentals;
