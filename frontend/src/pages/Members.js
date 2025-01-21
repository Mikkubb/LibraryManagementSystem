import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Members = () => {
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) throw new Error('Access denied');
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMembers(data))
      .catch(error => console.error('Error fetching members:', error));
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert('User deleted successfully');
        setMembers(members.filter(member => member._id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-3">
      <h1>MEMBERS</h1>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>USER_ID</th>
            <th>EMAIL</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.userId}</td>
              <td>{member.email}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>
                <Button variant="warning" as={Link} to={`/members/edit/${member._id}`} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(member._id)} className="mr-2">Delete</Button>
                <Button variant="success" as={Link} to={`/members/rentals/${member.userId}`}>Rentals</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Members;
