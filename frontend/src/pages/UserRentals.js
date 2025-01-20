import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const UserRentals = () => {
  const [rentals, setRentals] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:3001/api/rentals', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const userRentals = data.filter(rental => rental.user.userId === user.userId);
        setRentals(userRentals);
      })
      .catch(error => console.error('Error fetching rentals:', error));
  }, [token, user.userId]);

  return (
    <div className="container mt-3">
      <h1>RENTALS</h1>
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
                <td>{rental.user.userId}</td>
                <td>{rental.user.email}</td>
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
