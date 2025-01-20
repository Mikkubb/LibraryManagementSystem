import React, { useState } from 'react';

const AddLibrarian = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...form, role: 'librarian' }),
      });
      if (response.ok) {
        alert('Librarian added successfully');
      } else {
        alert('Failed to add librarian');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-librarian-container">
      <form onSubmit={handleSubmit}>
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
