import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Login from './pages/Login';
import Register from './pages/Register';
import AddLibrarian from './pages/AddLibrarian';
import YourProfile from './pages/YourProfile';
import EditProfile from './pages/EditProfile';
import Rentals from './pages/Rentals';
import RentBook from './pages/RentBook';
import PostponeReturnDate from './pages/PostponeReturnDate';
import UserRentals from './pages/UserRentals';
import Members from './pages/Members';
import EditMember from './pages/EditMember';
import MemberRentals from './pages/MemberRentals';
import Reviews from './pages/Reviews';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<PrivateRoute allowedRoles={['user', 'librarian', 'admin']}><Books /></PrivateRoute>} />
          <Route path="/books/add" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><AddBook /></PrivateRoute>} />
          <Route path="/books/edit/:id" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><EditBook /></PrivateRoute>} />
          <Route path="/add-librarian" element={<PrivateRoute allowedRoles={['admin']}><AddLibrarian /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={['user', 'librarian']}><YourProfile /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute allowedRoles={['user', 'librarian']}><EditProfile /></PrivateRoute>} />
          <Route path="/rentals" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><Rentals /></PrivateRoute>} />
          <Route path="/rent-book" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><RentBook /></PrivateRoute>} />
          <Route path="/rentals/postpone/:id" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><PostponeReturnDate /></PrivateRoute>} />
          <Route path="/user-rentals" element={<PrivateRoute allowedRoles={['user']}><UserRentals /></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><Members /></PrivateRoute>} />
          <Route path="/members/edit/:id" element={<PrivateRoute allowedRoles={['librarian', 'admin']}><EditMember /></PrivateRoute>} />
          <Route path="/members/rentals/:userId" element={<PrivateRoute allowedRoles={['admin', 'librarian']}><MemberRentals /></PrivateRoute>} />
          <Route path="/books/:bookId/reviews" element={<PrivateRoute allowedRoles={['user', 'librarian', 'admin']}><Reviews /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
