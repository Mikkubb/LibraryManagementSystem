import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

const Books = () => {
  const [books, setBooks] = useState([]);
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/api/books', {
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
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, [token]);

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setBooks(books.filter(book => book._id !== id));
        } else {
          console.error('Error deleting book');
        }
      })
      .catch(error => console.error('Error deleting book:', error));
  };

  return (
    <div className="container mt-3">
      <h1>BOOKS</h1>
      {(userRole === 'admin' || userRole === 'librarian') && (
        <Button variant="primary" as={Link} to="/books/add">
          Add Book
        </Button>
      )}
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>BOOK_ID</th>
              <th>TITLE</th>
              <th>AUTHOR</th>
              <th>GENRE</th>
              <th>ISBN</th>
              <th>COPIES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.copies}</td>
                <td>
                  {/* Przyciski dla Admina i Bibliotekarza */}
                  {(userRole === 'admin' || userRole === 'librarian') && (
                    <>
                      <Button
                        variant="warning"
                        as={Link}
                        to={`/books/edit/${book._id}`}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(book._id)}
                        className="mr-2"
                      >
                        Delete
                      </Button>
                      <Button variant="info" className="mr-2">
                        Reviews
                      </Button>
                      <Button variant="success">Rent</Button>
                    </>
                  )}
                  {/* Przyciski dla Zwykłego Użytkownika */}
                  {userRole === 'user' && (
                    <Button variant="info">Reviews</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Books;
