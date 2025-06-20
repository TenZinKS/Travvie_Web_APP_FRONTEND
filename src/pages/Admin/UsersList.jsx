import { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:4000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleBlock = async (userId) => {
    try {
      await axios.put(`http://localhost:4000/api/users/block/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to block/unblock user");
    }
  };

  const handlePromote = async (userId) => {
    try {
      await axios.put(`http://localhost:4000/api/users/promote/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to promote user to admin");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">User Management</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            ) : (
              users.map((user) => {
                const isBlocked = user.isBlocked ?? false;
                const isAdmin = user.isAdmin ?? false;

                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          isBlocked ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      {isAdmin ? (
                        <span className="badge bg-primary">Admin</span>
                      ) : (
                        "User"
                      )}
                    </td>
                    <td className="d-flex flex-wrap justify-content-center gap-2">
                      <button
                        className={`btn btn-sm ${
                          isBlocked ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => handleBlock(user._id)}
                      >
                        {isBlocked ? "Unblock" : "Block"}
                      </button>

                      {!isAdmin && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handlePromote(user._id)}
                        >
                          Make Admin
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;
