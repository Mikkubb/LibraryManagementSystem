import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setForm({
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        password: '',
      }))
      .catch(error => {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details');
        navigate('/members');
      });
  }, [id, token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value || '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('Member updated successfully');
        navigate('/members');
      } else {
        alert('Failed to update member');
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>EDIT MEMBER</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          name="email" 
          id="email"
          value={form.email} 
          onChange={handleChange} 
          required 
          autoComplete="email" 
        />
        
        <label htmlFor="firstName">First Name</label>
        <input 
          type="text" 
          name="firstName" 
          id="firstName"
          value={form.firstName} 
          onChange={handleChange} 
          required 
          autoComplete="given-name" 
        />
        
        <label htmlFor="lastName">Last Name</label>
        <input 
          type="text" 
          name="lastName" 
          id="lastName"
          value={form.lastName} 
          onChange={handleChange} 
          required 
          autoComplete="family-name" 
        />
        
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          name="password" 
          id="password"
          value={form.password} 
          onChange={handleChange} 
          autoComplete="new-password" 
        />
        
        <button className="save-button" type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditMember;
