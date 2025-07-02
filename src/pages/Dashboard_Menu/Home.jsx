import { useEffect, useState } from "react";
import axios from "axios";
import { FaMedal, FaCheckCircle, FaTimesCircle, FaPlane, FaHeart } from "react-icons/fa";
import CountUp from "react-countup";

function Home() {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    wishlist: 0,
    cancelled: 0,
    upcoming: 0,
  });
  const [rank, setRank] = useState("Bronze");
  const [completionRate, setCompletionRate] = useState(0);
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const travelTips = [
    "Always keep digital and physical copies of important documents.",
    "Pack light to make travel easier.",
    "Learn basic phrases in the local language.",
    "Keep your valuables safe and secure.",
    "Respect local customs and traditions.",
    "Stay hydrated during your journey.",
    "Try local food for an authentic experience.",
    "Keep emergency contacts handy.",
    "Use apps to navigate and translate.",
    "Check visa requirements before traveling."
  ];

  useEffect(() => {
    fetchTrips();
    generateRandomTip();
  }, []);

  const generateRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * travelTips.length);
    setTip(travelTips[randomIndex]);
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/trips/user/${user.id}`);
      const allTrips = res.data;

      const completed = allTrips.filter(t => t.status === "completed").length;
      const wishlist = allTrips.filter(t => t.status === "wishlist").length;
      const cancelled = allTrips.filter(t => t.status === "cancelled").length;
      const upcoming = allTrips.filter(
        t => t.status === "planned" || t.status === "upcoming"
      ).length;

      const total = completed + cancelled;
      let completionPct = 0;

      if (total > 0) {
        completionPct = Math.round((completed / total) * 100);
      }

      let rank = "Bronze";
      let msg = "Start exploring more to level up your travel profile!";
      if (completionPct > 70) {
        rank = "Gold";
        msg = "Awesome! You’re a seasoned traveller with fantastic trip success.";
      } else if (completionPct >= 40) {
        rank = "Silver";
        msg = "Good job! Keep travelling and aim for Gold.";
      } else if (total === 0 && allTrips.length === 0) {
        msg = "No trips yet. Let’s start planning your first adventure!";
      } else {
        msg = "Consider planning carefully to avoid cancellations.";
      }

      setStats({
        completed,
        wishlist,
        cancelled,
        upcoming,
      });
      setRank(rank);
      setCompletionRate(completionPct);
      setMessage(msg);
      setTrips(allTrips);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">🌍 My Travel Dashboard</h3>

      <div className="row g-4">
        <StatCard
          title="Completed Trips"
          count={stats.completed}
          icon={<FaCheckCircle />}
          color="success"
        />
        <StatCard
          title="Wishlist Trips"
          count={stats.wishlist}
          icon={<FaHeart />}
          color="warning"
        />
        <StatCard
          title="Cancelled Trips"
          count={stats.cancelled}
          icon={<FaTimesCircle />}
          color="danger"
        />
        <StatCard
          title="Upcoming Trips"
          count={stats.upcoming}
          icon={<FaPlane />}
          color="primary"
        />
      </div>

      <div className="mt-5 text-center">
        <RankCard rank={rank} completionRate={completionRate} message={message} />
      </div>

      <div className="mt-4 text-center">
        <h5 className="mb-3">✈️ Travel Tip of the Day</h5>
        <div className="alert alert-secondary d-inline-block" style={{ maxWidth: "600px" }}>
          {tip}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon, color }) {
  return (
    <div className="col-md-3">
      <div className={`card text-white bg-${color} h-100`}>
        <div className="card-body text-center">
          <div style={{ fontSize: "2rem" }}>{icon}</div>
          <h5 className="card-title mt-2">{title}</h5>
          <h2 className="card-text mt-3">
            <CountUp end={count} duration={1} />
          </h2>
        </div>
      </div>
    </div>
  );
}

function RankCard({ rank, completionRate, message }) {
  const rankColors = {
    Gold: "warning",
    Silver: "secondary",
    Bronze: "dark",
  };

  const rankIcons = {
    Gold: <FaMedal style={{ color: "gold" }} />,
    Silver: <FaMedal style={{ color: "silver" }} />,
    Bronze: <FaMedal style={{ color: "#cd7f32" }} />,
  };

  return (
    <div
      className={`card border-${rankColors[rank]} mb-3 mx-auto`}
      style={{ maxWidth: "400px" }}
    >
      <div className={`card-header bg-${rankColors[rank]} text-white`}>
        <h5 className="mb-0">
          {rankIcons[rank]} {rank} Traveller
        </h5>
      </div>
      <div className="card-body">
        <h6 className="card-title mb-3">Completion Rate</h6>
        <h3 className="card-text mb-3">
          <CountUp end={completionRate} duration={1.5} />%
        </h3>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
}

export default Home;
