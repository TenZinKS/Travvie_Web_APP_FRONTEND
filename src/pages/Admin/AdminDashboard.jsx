import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`);
      fetchUsers(); // Refresh user list
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">Admin Panel - User Management</h3>
      <table className="table table-bordered shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: "100px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
