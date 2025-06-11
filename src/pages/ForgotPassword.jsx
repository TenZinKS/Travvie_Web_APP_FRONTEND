import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link will be sent to: " + email);
    // Later: send email to backend for real password reset
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="row w-100" style={{ maxWidth: "1200px" }}>
        {/* Left - Logo */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-5">
          <img src="/logo.png" alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
          <h2 className="fw-bold text-dark">TRAVVIE</h2>
          <p className="text-secondary">Plan Less. Explore More</p>
        </div>

        {/* Right - Forgot Password Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-4">
          <div
            className="bg-white shadow rounded p-4 text-center"
            style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
          >
            <h4 className="fw-bold mb-4">Forgot Password</h4>
            <p className="text-muted mb-4">Enter your email to receive a reset link.</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 rounded-pill px-4 py-2"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ backgroundColor: "#f0f4ff", border: "2px solid #587ff3" }}
                required
              />
              <button type="submit" className="btn w-100 mb-3 text-white fw-bold rounded-pill" style={{ backgroundColor: "#00addc", fontSize: "1.1rem" }}>
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
