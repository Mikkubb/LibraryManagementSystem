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

  const userId = user?.userId || 'ND';
  const email = user?.email || 'ND';
  const firstName = user?.firstName || 'ND';
  const lastName = user?.lastName || 'ND';

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
      <p><strong>ID:</strong> {userId}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>First Name:</strong> {firstName}</p>
      <p><strong>Last Name:</strong> {lastName}</p>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button className="save-button" onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default YourProfile;
