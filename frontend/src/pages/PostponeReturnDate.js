import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PostponeReturnDate.css';

const PostponeReturnDate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rental, returnUrl } = location.state || {};

  const [newDateToReturn, setNewDateToReturn] = useState(rental?.dateToReturn || '');
  const [error, setError] = useState('');
  const dateOfRental = new Date(rental?.dateOfRental).toISOString().split('T')[0];

  const handleSave = async (e) => {
    e.preventDefault();

    if (newDateToReturn <= dateOfRental) {
      setError("New return date must be later than the rental date.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/rentals/postpone/${rental._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ newDateToReturn }),
      });
      if (response.ok) {
        alert('Return date postponed successfully');
        navigate(returnUrl || '/rentals');
      } else {
        alert('Failed to postpone return date');
      }
    } catch (error) {
      console.error('Error postponing return date:', error);
    }
  };

  return (
    <div className="postpone-container">
      <h2>CHANGE RETURN DATE</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="dateToReturn">Date to return</label>
        <input
          type="date"
          id="dateToReturn"
          value={newDateToReturn}
          min={dateOfRental}
          onChange={(e) => {
            setNewDateToReturn(e.target.value);
            setError('');
          }}
          required
        />
        
        {error && <p className="error">{error}</p>}

        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
};

export default PostponeReturnDate;
