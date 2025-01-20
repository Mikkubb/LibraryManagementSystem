import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const UserRentals = () => {
  const [rentals, setRentals] = useState([]);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
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
              <tr key={rental._id}>
                <td>{currentUser.userId}</td>
                <td>{currentUser.email}</td>
                <td>{rental.book.bookId}</td>
                <td>{rental.book.title}</td>
                <td>{new Date(rental.dateOfRental).toLocaleDateString()}</td>
                <td>{new Date(rental.dateToReturn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserRentals;
