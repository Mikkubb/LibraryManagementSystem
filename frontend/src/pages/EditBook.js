import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const EditBook = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/books/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setAuthor(data.author);
        setGenre(data.genre);
        setIsbn(data.isbn);
        setCopies(data.copies);
      })
      .catch(error => console.error('Error fetching book details:', error));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedBook = { title, author, genre, isbn, copies: parseInt(copies) };

    fetch(`http://localhost:3001/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedBook),
    })
      .then(response => {
        if (response.ok) {
          navigate('/books');
        } else {
          throw new Error('Failed to update book');
        }
      })
      .catch(error => {
        console.error('Error updating book:', error);
        alert('Failed to update book');
      });
  };

  return (
    <div className="container mt-3">
      <h1>EDIT BOOK</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="author">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author's name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="genre">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="isbn">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="copies">
          <Form.Label>Copies</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of copies"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update Book
        </Button>
      </Form>
    </div>
  );
};

export default EditBook;
