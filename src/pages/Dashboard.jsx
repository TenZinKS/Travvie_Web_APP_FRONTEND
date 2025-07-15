import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaSuitcase,
  FaUserCircle,
  FaRobot,
  FaBars,
} from "react-icons/fa";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: <FaHome />, route: "/dashboard/home" },
    { name: "Create Trip", icon: <FaRobot />, route: "/dashboard/create_trip" },
    {
      name: "My Trips",
      icon: <FaSuitcase />,
      route: "/dashboard/my_trips",
      tooltip:
        "View and manage your trips, whether planned, upcoming, or completed.",
    },
    { name: "Saved Trips", icon: <FaBoxOpen />, route: "/dashboard/saved_trips" },
  ];

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f9fbfd" }}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="d-flex flex-column align-items-center py-4 px-3 bg-white border-end shadow-sm"
          style={{ width: "250px" }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: "200px",
              marginBottom: "5px",
              objectFit: "contain",
              borderRadius: "5px",
            }}
          />

          <div className="nav flex-column text-start w-100 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="d-flex align-items-center gap-3 px-3 py-2 rounded text-dark"
                style={{
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  position: "relative",
                }}
                onClick={() => navigate(item.route)}
                title={item.tooltip || ""}
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow-1">
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="toggle-button"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <FaBars size={22} />
            </button>
            <h4 className="fw-bold m-0">Travvie</h4>
          </div>
          <FaUserCircle
            data-testid="profile-icon"
            size={28}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          />
        </div>

        <div className="p-4" data-testid="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
