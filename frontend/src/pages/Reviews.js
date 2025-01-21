import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Form } from 'react-bootstrap';
import '../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [opinion, setOpinion] = useState('');
  const [rate, setRate] = useState(5);
  const { state } = useLocation();
  const { bookId, author, title } = state || {};
  const token = localStorage.getItem('token');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user._id : null;
  const userRole = user ? user.role : null;

  useEffect(() => {
    if (bookId) {
      fetch(`http://localhost:3001/api/reviews/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => response.json())
        .then(data => setReviews(data))
        .catch(error => console.error('Error fetching reviews:', error));
    }
  }, [bookId, token]);

  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, userId, opinion, rate }),
      });
      const data = await response.json();
      if (response.ok) {
        setReviews([...reviews, data.review]);
        setOpinion('');
        setRate(5);
      } else {
        alert(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Review deleted successfully');
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="container mt-3">
      <h1>Reviews</h1>
      <p><strong>Author:</strong> {author || 'ND'}</p>
      <p><strong>Title:</strong> {title || 'ND'}</p>

      <Form onSubmit={handleAddReview}>
        <Form.Group controlId="opinion">
          <Form.Label>Opinion</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            maxLength={500}
            placeholder="Write your opinion"
            required
          />
        </Form.Group>
        <Form.Group controlId="rate">
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min={1}
            max={5}
            placeholder="Give a rating 1-5"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">Add Review</Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            {userRole === 'admin' || userRole === 'librarian' ? <th>User ID</th> : null}
            <th>Name</th>
            <th>Opinion</th>
            <th>Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              {userRole === 'admin' || userRole === 'librarian' ? (
                <td>{review.user?.userId || 'ND'}</td>
              ) : null}
              <td>{review.user?.firstName || 'Anonymous'}</td>
              <td className="wrap-text">{review.opinion || 'ND'}</td>
              <td>{review.rate || 'ND'}</td>
              <td>
                {(userRole === 'admin' || userRole === 'librarian' || userId === review.user?._id) && (
                  <Button variant="danger" onClick={() => handleDeleteReview(review._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reviews;
