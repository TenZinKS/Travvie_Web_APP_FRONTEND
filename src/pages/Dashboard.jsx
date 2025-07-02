import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaSuitcase,
  FaUserCircle,
  FaRobot,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBot, setShowBot] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: <FaHome />, route: "/dashboard/home" },
    { name: "Create Trip", icon: <FaRobot />, route: "/dashboard/create_trip" },
    { name: "My Trips", icon: <FaSuitcase />, route: "/dashboard/my_trips" },
    { name: "Saved Trips", icon: <FaBoxOpen />, route: "/dashboard/saved_trips" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f9fbfd" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="d-flex flex-column align-items-center py-4 px-3 bg-white border-end shadow-sm"
          style={{ width: "250px" }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "200px", marginBottom: "5px", objectFit: "contain", borderRadius: "5px" }}
          />

          <div className="nav flex-column text-start w-100 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="d-flex align-items-center gap-3 px-3 py-2 rounded text-dark"
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                onClick={() => navigate(item.route)}
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
            <FaBars size={22} style={{ cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)} />
            <h4 className="fw-bold m-0">Travvie</h4>
          </div>
          <FaUserCircle size={28} style={{ cursor: "pointer" }} onClick={() => navigate("/profile")} />
        </div>

        {/* Outlet for nested routes */}
        <div className="p-4">
          <Outlet />
        </div>

        {/* Floating Bot Icon */}
        <div
          onClick={() => setShowBot(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#00addc",
            padding: "12px",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <FaRobot size={26} color="white" />
        </div>

        {/* Chatbot Modal */}
        {showBot && (
          <div
            style={{
              position: "fixed",
              bottom: "90px",
              right: "20px",
              width: "350px",
              height: "450px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "15px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center p-3 bg-info text-white"
              style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
            >
              <strong>Travvie AI Assistant</strong>
              <FaTimes
                onClick={() => setShowBot(false)}
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
              />
            </div>

            <div className="flex-grow-1 p-3 text-muted" style={{ overflowY: "auto" }}>
              <p>👋 Hello! I'm your travel assistant. How can I help you today?</p>
              <p className="text-secondary small">[You can integrate your chatbot UI here]</p>
            </div>

            <div className="p-2 border-top">
              <input
                className="form-control"
                placeholder="Type your message..."
                disabled
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
