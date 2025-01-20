import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const AddLibrarian = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/registerLibrarian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert('Librarian added successfully');
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add librarian');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the librarian');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>ADD LIBRARIAN</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Add Librarian</button>
      </form>
    </div>
  );
};

export default AddLibrarian;
