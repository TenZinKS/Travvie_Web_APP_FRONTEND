import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      alert("Login successful: " + res.data.user.name);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="row w-100" style={{ maxWidth: "1200px" }}>
        {/* Left - Logo + Text */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-5">
          <img src="/logo.png" alt="Logo" style={{ width: "300px", marginBottom: "20px" }} />
        </div>

        {/* Right - Login Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-4">
          <div className="bg-white shadow rounded p-4 text-center" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <h4 className="fw-bold mb-4">Login</h4>
            <input
              type="email"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "2px solid #587ff3" }}
            />
            <input
              type="password"
              className="form-control mb-2 rounded-pill px-4 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "none" }}
            />

            <div className="text-end mb-3">
            <Link to="/forgot-password" className="text-primary text-decoration-none fw-semibold">
              Forgot your password?
            </Link>
            </div>

            <button className="btn w-100 mb-3 text-white fw-bold rounded-pill" style={{ backgroundColor: "#00addc", fontSize: "1.1rem" }} onClick={handleLogin}>
              Sign in
            </button>
            <Link to="/signup" className="btn btn-light shadow-sm w-100 fw-bold rounded-pill">
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
