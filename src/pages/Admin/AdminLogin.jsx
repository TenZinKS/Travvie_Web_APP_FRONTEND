import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", {
        email,
        password,
      });

      const user = res.data.user;

      if (!user.isAdmin) {
        alert("Access denied: You are not an admin");
        return;
      }

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      navigate("/admin");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.msg || "Server error"));
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="row w-100" style={{ maxWidth: "1200px" }}>
        {/* Left - Logo */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-5">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "300px", marginBottom: "20px" }}
          />
        </div>

        {/* Right - Admin Login Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-4">
          <div
            className="bg-white shadow rounded p-4 text-center"
            style={{
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <h2 className="fw-bold text-primary">Admin Panel</h2>
            <p className="text-muted">Manage users and app data efficiently</p>
            <input
              type="email"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: "#f0f4ff",
                border: "2px solid #587ff3",
              }}
            />
            <input
              type="password"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#f0f4ff",
                border: "none",
              }}
            />
            <button
              className="btn w-100 mb-3 text-white fw-bold rounded-pill"
              style={{
                backgroundColor: "#00addc",
                fontSize: "1.1rem",
              }}
              onClick={handleLogin}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
