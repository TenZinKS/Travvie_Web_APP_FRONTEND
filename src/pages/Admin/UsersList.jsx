import { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container py-4">
      <h3>User Management</h3>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user._id}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
