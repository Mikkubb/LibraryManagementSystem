import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import '../styles/Navbar.css';

const NavBar = () => {
  const navigate = useNavigate();


  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Navbar.Brand as={Link} to="/">LIBRARY</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {/* Gdy użytkownik nie jest zalogowany */}
          {!isLoggedIn && (
            <>
              <Nav.Link as={Link} to="/register">REGISTER</Nav.Link>
              <Nav.Link as={Link} to="/login">LOGIN</Nav.Link>
            </>
          )}

          {/* Gdy użytkownik jest zalogowany jako admin */}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <Nav.Link as={Link} to="/books">BOOKS</Nav.Link>
              <Nav.Link as={Link} to="/members">MEMBERS</Nav.Link>
              <Nav.Link as={Link} to="/rentals">RENTALS</Nav.Link>
              <Nav.Link as={Link} to="/add-librarian">ADD LIBRARIAN</Nav.Link>
              <Nav.Link onClick={handleLogout}>LOGOUT</Nav.Link>
            </>
          )}

          {/* Gdy użytkownik jest zalogowany jako bibliotekarz */}
          {isLoggedIn && userRole === 'librarian' && (
            <>
              <Nav.Link as={Link} to="/books">BOOKS</Nav.Link>
              <Nav.Link as={Link} to="/members">MEMBERS</Nav.Link>
              <Nav.Link as={Link} to="/rentals">RENTALS</Nav.Link>
              <Nav.Link as={Link} to="/profile">YOUR PROFILE</Nav.Link>
              <Nav.Link onClick={handleLogout}>LOGOUT</Nav.Link>
            </>
          )}

          {/* Gdy użytkownik jest zalogowany jako zwykły użytkownik */}
          {isLoggedIn && userRole === 'user' && (
            <>
              <Nav.Link as={Link} to="/books">BOOKS</Nav.Link>
              <Nav.Link as={Link} to="/user-rentals">RENTALS</Nav.Link>
              <Nav.Link as={Link} to="/profile">YOUR PROFILE</Nav.Link>
              <Nav.Link onClick={handleLogout}>LOGOUT</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
