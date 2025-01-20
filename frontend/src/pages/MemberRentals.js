import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const MemberRentals = () => {
  const { userId } = useParams();
  const [rentals, setRentals] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/rentals/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  }, [token, userId]);

  const handlePostpone = (rental) => {
    const returnUrl = `/members/rentals/${userId}`;
    navigate(`/rentals/postpone/${rental._id}`, { state: { rental, returnUrl } });
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

  return (
    <div className="container mt-3">
      <h1>RENTALS FOR USER {userId}</h1>
      {rentals.length === 0 ? (
        <p>This user has no rentals.</p>
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
              <th>ACTIONS</th>
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
                <td>
                  <Button variant="warning" onClick={() => handlePostpone(rental)} className="mr-2">Postpone</Button>
                  <Button variant="danger" onClick={() => handleReturn(rental._id)}>Return</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MemberRentals;
