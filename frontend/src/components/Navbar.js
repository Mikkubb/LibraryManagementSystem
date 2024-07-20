import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import '../styles/Navbar.css'

const Header = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Navbar.Brand as={Link} to="/">LIBRARY</Navbar.Brand>
    </Navbar>
  );
};

export default Header;
