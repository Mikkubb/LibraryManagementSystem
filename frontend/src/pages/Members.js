import React, { useEffect, useState } from 'react';
import { Button, Table, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ColumnWidth.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const loggedUser = JSON.parse(localStorage.getItem('user'));

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
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user? This will also delete their reviews.'
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('User deleted successfully');
        setMembers(members.filter(member => member._id !== userId));
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An unexpected error occurred while deleting the user.');
    }
  };

  const filteredMembers = members.filter(member =>
    member.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-3">
      <h1>MEMBERS</h1>
      <FormControl
        type="text"
        placeholder="Search by USER_ID..."
        className="mt-3 mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
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
          {filteredMembers.map((member) => (
            <tr key={member._id}>
              <td>{member.userId || 'ND'}</td>
              <td className="table-wrap" >{member.email || 'ND'}</td>
              <td className="table-wrap" >{member.firstName || 'ND'}</td>
              <td className="table-wrap" >{member.lastName || 'ND'}</td>
              <td>
                <Button
                  variant="warning"
                  as={Link}
                  to={`/members/edit/${member._id}`}
                  className="mr-2"
                  disabled={loggedUser && loggedUser._id === member._id}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(member._id)}
                  className="mr-2"
                  disabled={loggedUser && loggedUser._id === member._id}
                >
                  Delete
                </Button>
                <Button
                  variant="success"
                  as={Link}
                  to={`/members/rentals/${member.userId}`}
                >
                  Rentals
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Members;