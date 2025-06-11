import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBoxOpen, FaCalendarAlt, FaSuitcase, FaUserCircle, FaRobot } from "react-icons/fa";

function Dashboard() {
  const [activePage, setActivePage] = useState("Itinerary");

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f9fbfd" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column align-items-center py-4 px-3 bg-white border-end shadow-sm"
        style={{ width: "250px" }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "140px",
            marginBottom: "40px",
            objectFit: "contain",
            borderRadius: "10px"
          }}
        />

        <div className="nav flex-column text-start w-100 gap-4">
          <div
            className={`d-flex align-items-center gap-3 px-3 py-2 rounded ${
              activePage === "Home" ? "bg-primary text-white" : "text-dark"
            }`}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => setActivePage("Home")}
          >
            <FaHome size={22} />
            Home
          </div>
          <div
            className={`d-flex align-items-center gap-3 px-3 py-2 rounded ${
              activePage === "Packing" ? "bg-primary text-white" : "text-dark"
            }`}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => setActivePage("Packing")}
          >
            <FaBoxOpen size={22} />
            Packing
          </div>
          <div
            className={`d-flex align-items-center gap-3 px-3 py-2 rounded ${
              activePage === "Itinerary" ? "bg-primary text-white" : "text-dark"
            }`}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => setActivePage("Itinerary")}
          >
            <FaCalendarAlt size={22} />
            Itinerary
          </div>
          <div
            className={`d-flex align-items-center gap-3 px-3 py-2 rounded ${
              activePage === "Trips" ? "bg-primary text-white" : "text-dark"
            }`}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => setActivePage("Trips")}
          >
            <FaSuitcase size={22} />
            My Trips
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1">
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center px-5 py-4 border-bottom bg-white shadow-sm">
          <h3 className="fw-bold m-0">{activePage}</h3>
          <Link to="/profile" className="text-dark">
            <FaUserCircle size={30} style={{ cursor: "pointer" }} />
          </Link>
        </div>

        {/* You can now add your own content here for each activePage if needed */}
        <div className="p-5 text-center text-muted">
          <p className="fs-4">Welcome to the {activePage} section ✨</p>
        </div>

        {/* Floating Bot Icon */}
        <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
          <FaRobot size={32} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
