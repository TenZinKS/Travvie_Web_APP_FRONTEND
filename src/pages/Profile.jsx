import { FaEdit, FaKey, FaHistory, FaChevronRight } from "react-icons/fa";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <h3 className="fw-bold mb-4">My Profile</h3>

      {/* Profile Card */}
      <div
        className="rounded shadow text-white text-center p-4 mb-5"
        style={{
          backgroundColor: "#00addc",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "20px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Avatar"
          className="rounded-circle mb-3 border border-white"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
          }}
        />
        <h5 className="fw-bold">{user?.name}</h5>
        <p className="mb-3">{user?.email}</p>
        <button className="btn btn-outline-light btn-sm rounded-pill px-4">
          Edit Account <FaEdit className="ms-2" />
        </button>
      </div>

      {/* Options */}
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <FaKey />
            <span className="fw-semibold">Change Password</span>
          </div>
          <FaChevronRight />
        </div>

        <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <FaHistory />
            <span className="fw-semibold">History</span>
          </div>
          <FaChevronRight />
        </div>
      </div>

      {/* Logout */}
      <button
        className="btn btn-light mt-5 px-5 py-2 fw-bold text-danger shadow-sm"
        onClick={handleLogout}
        style={{ borderRadius: "15px" }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
