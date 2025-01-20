import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const YourProfile = () => {
  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  let user = null;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>YOUR PROFILE</h2>
      <p><strong>ID:</strong> {user.userId}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button className="save-button" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
      </div>
    </div>
  );
};

export default YourProfile;
