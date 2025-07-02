import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Dashboard_Menu/Home";
import Create_Trip from "./pages/Dashboard_Menu/Create_Trip";
import My_Trips from "./pages/Dashboard_Menu/My_Trips";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UsersList from "./pages/Admin/UsersList";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";
import EditProfile from "./pages/Auth/EditProfile";
import Saved_Trips from "./pages/Dashboard_Menu/Saved_Trips";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersList />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="create_trip" element={<Create_Trip />} />
          <Route path="my_trips" element={<My_Trips />} />
          <Route path="saved_trips" element={<Saved_Trips/>} />
        </Route>

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;