import { useRef, useState } from "react";
import {
  FaEdit,
  FaKey,
  FaHistory,
  FaChevronRight,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState(user?.name || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Create a ref for file input
  const fileInputRef = useRef();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await axios.put(
        `http://localhost:4000/api/auth/${user.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to update profile");
    }
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
        {/* ✅ Click image to trigger input via ref */}
        <img
          src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
          alt="Avatar"
          className="rounded-circle mb-3 border border-white"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            cursor: isEditing ? "pointer" : "default",
          }}
          onClick={() => {
            if (isEditing) fileInputRef.current.click();
          }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {isEditing ? (
          <input
            type="text"
            className="form-control mt-2 mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h5 className="fw-bold">{user?.name}</h5>
        )}

        <p className="mb-3">{user?.email}</p>

        {isEditing ? (
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-light btn-sm rounded-pill px-4"
              onClick={handleSave}
            >
              Save <FaSave className="ms-2" />
            </button>
            <button
              className="btn btn-outline-light btn-sm rounded-pill px-4"
              onClick={() => {
                setIsEditing(false);
                setName(user.name);
                setProfilePic(null);
                setPreview(user.profilePic);
              }}
            >
              Cancel <FaTimes className="ms-2" />
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline-light btn-sm rounded-pill px-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Account <FaEdit className="ms-2" />
          </button>
        )}
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
