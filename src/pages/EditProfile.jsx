import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    if (image) form.append("profilePic", image);

    try {
      const res = await axios.put(`http://localhost:4000/api/auth/${user.id}`, form);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated!");
      navigate("/profile");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
