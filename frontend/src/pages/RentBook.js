import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/RentBook.css';

const RentBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId = 'ND', title = 'ND' } = location.state || {};

  const [userId, setUserId] = useState('');
  const [dateToReturn, setDateToReturn] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateOfRental = new Date().toISOString().split('T')[0];

    if (!dateToReturn || dateToReturn <= dateOfRental) {
      setError("Return date must be later than the rental date.");
      return;
    }

    if (!userId || isNaN(userId)) {
      setError("Invalid User ID. Please enter a valid numeric User ID.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/rentals/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ bookId, userId, dateToReturn }),
      });

      if (response.ok) {
        alert('Book rented successfully');
        navigate('/rentals');
      } else {
        const errorData = await response.json();
        alert(`Failed to rent book: ${errorData.message || 'Unexpected error occurred'}`);
      }
    } catch (error) {
      console.error('Error renting book:', error);
      alert('An unexpected error occurred while renting the book.');
    }
  };

  return (
    <div className="rent-book-container">
      <h2>RENT A BOOK</h2>
      <form onSubmit={handleSubmit}>
        <label>Book ID</label>
        <input type="text" value={bookId} readOnly />

        <label>Title</label>
        <input type="text" value={title} readOnly />

        <label>User ID</label>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setError('');
          }}
          required
        />

        <label>Date to return</label>
        <input
          type="date"
          value={dateToReturn}
          onChange={(e) => {
            setDateToReturn(e.target.value);
            setError('');
          }}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="save-button">Rent</button>
      </form>
    </div>
  );
};

export default RentBook;
