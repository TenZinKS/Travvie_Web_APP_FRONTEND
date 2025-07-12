import { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = async (e) => {
    e.preventDefault();

    if (newPass !== confirm) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/auth/change-password/${user.id}`,
        {
          currentPassword: current,
          newPassword: newPass,
        }
      );
      setMessage(res.data.msg);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Error updating password.");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4 text-center">🔑 Change Password</h3>
      <form onSubmit={handleChange}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100">Change Password</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default ChangePassword;
