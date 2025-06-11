import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgotpassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import Itinerary from "./pages/Itinerary";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="trips" element={<Trips />} />
        </Route>

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;