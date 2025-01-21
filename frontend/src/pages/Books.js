import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, FormControl } from 'react-bootstrap';
import '../styles/ColumnWidth.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/books', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error('Unexpected response format:', data);
          setBooks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setBooks([]);
      });
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book? This will also delete its reviews.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBooks(books.filter(book => book._id !== id));
        alert('Book deleted successfully');
      } else {
        alert(data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleRent = (book) => {
    navigate('/rent-book', { state: { bookId: book.bookId || 'ND', title: book.title || 'ND' } });
  };

  const filteredBooks = books.filter(book => book.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mt-3">
      <h1>BOOKS</h1>
      <FormControl
        type="text"
        placeholder="Search by title..."
        className="mt-3 mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {(userRole === 'admin' || userRole === 'librarian') && (
        <Button variant="primary" as={Link} to="/books/add">
          Add Book
        </Button>
      )}
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
          {filteredBooks.map(book => (
            <tr key={book._id}>
              <td>{book.bookId || 'ND'}</td>
              <td className="table-wrap" >{book.title || 'ND'}</td>
              <td className="table-wrap" >{book.author || 'ND'}</td>
              <td className="table-wrap" >{book.genre || 'ND'}</td>
              <td className="table-wrap" >{book.isbn || 'ND'}</td>
              <td>{book.copies ?? 'ND'}</td>
              <td>
                {(userRole === 'admin' || userRole === 'librarian') && (
                  <>
                    <Button
                      variant="warning"
                      as={Link}
                      to={`/books/edit/${book._id}`}
                      className="mr-2"
                      disabled={!book._id}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(book._id)}
                      className="mr-2"
                      disabled={!book._id}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="info"
                      as={Link}
                      to={`/books/${book._id}/reviews`}
                      state={{
                        bookId: book._id || 'ND',
                        author: book.author || 'ND',
                        title: book.title || 'ND',
                      }}
                      className="mr-2"
                      disabled={!book._id}
                    >
                      Reviews
                    </Button>
                    {book.copies > 0 ? (
                      <Button variant="success" onClick={() => handleRent(book)}>
                        Rent
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </>
                )}
                {userRole === 'user' && (
                  <Button
                    variant="info"
                    as={Link}
                    to={`/books/${book._id}/reviews`}
                    state={{
                      bookId: book._id || 'ND',
                      author: book.author || 'ND',
                      title: book.title || 'ND',
                    }}
                    disabled={!book._id}
                  >
                    Reviews
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
