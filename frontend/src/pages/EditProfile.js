import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3001/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser.user));
        alert('Profile updated successfully');
        navigate('/profile');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3001/api/auth/delete', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          localStorage.clear();
          alert('Account deleted successfully');
          navigate('/');
        } else {
          alert('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting the account');
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>EDIT PROFILE</h2>
      <form onSubmit={handleSave}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        
        <label>First Name</label>
        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        
        <label>Last Name</label>
        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        
        <div style={{ display: 'flex', gap: '160px', marginTop: '20px' }}>
          <button className="save-button" type="submit">Save</button>
          <button
            className="delete-button"
            type="button"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
