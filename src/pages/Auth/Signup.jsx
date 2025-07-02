import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        name,
        email,
        password,
      });
      alert(res.data.msg || "Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="row w-100" style={{ maxWidth: "1200px" }}>
        {/* Left - Logo */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-5">
          <img src="/logo.png" alt="Logo" style={{ width: "300px", marginBottom: "20px" }} />
        </div>

        {/* Right - Signup Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-4">
          <div
            className="bg-white shadow rounded p-4 text-center"
            style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
          >
            <h4 className="fw-bold mb-4">Create Account</h4>
            <input
              type="email"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "2px solid #587ff3" }}
            />
            <input
              type="text"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "none" }}
            />
            <input
              type="password"
              className="form-control mb-3 rounded-pill px-4 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "none" }}
            />
            <input
              type="password"
              className="form-control mb-4 rounded-pill px-4 py-2"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ backgroundColor: "#f0f4ff", border: "none" }}
            />
            <button
              className="btn w-100 mb-3 text-white fw-bold rounded-pill"
              style={{ backgroundColor: "#00addc", fontSize: "1.1rem" }}
              onClick={handleSignup}
            >
              Sign up
            </button>
            <Link to="/login" className="btn btn-light shadow-sm w-100 fw-bold rounded-pill">
              Already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
