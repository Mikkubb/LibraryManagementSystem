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
          <Route
            path="/books"
            element={
              <PrivateRoute allowedRoles={['user', 'librarian', 'admin']}>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/books/add"
            element={
              <PrivateRoute allowedRoles={['librarian', 'admin']}>
                <AddBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/books/edit/:id"
            element={
              <PrivateRoute allowedRoles={['librarian', 'admin']}>
                <EditBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-librarian"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AddLibrarian />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['user', 'librarian']}>
                <YourProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute allowedRoles={['user', 'librarian']}>
                <EditProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
