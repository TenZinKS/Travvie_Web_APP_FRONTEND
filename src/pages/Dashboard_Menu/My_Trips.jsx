import { useEffect, useState } from "react";
import axios from "axios";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields for new trip
  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    itinerary: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/trips/user/${user.id}`
      );
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTrip = async () => {
    try {
      await axios.post("http://localhost:4000/api/trips", {
        ...newTrip,
        userId: user.id,
      });
      setShowAddModal(false);
      setNewTrip({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        itinerary: "",
      });
      fetchTrips();
      alert("Trip added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add trip");
    }
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/api/trips/${tripId}`,
        { status: newStatus }
      );
      fetchTrips();
      setSelectedTrip(null);
    } catch (err) {
      alert("Failed to update trip status");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Trips</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Trip
        </button>
      </div>

      {/* Trips Table */}
      {trips.length === 0 ? (
        <div className="text-center text-muted">No trips found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Destination</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.title}</td>
                <td>{trip.destination}</td>
                <td>
                  {trip.startDate?.slice(0, 10)} -{" "}
                  {trip.endDate?.slice(0, 10)}
                </td>
                <td>
                  <span className={`badge ${getBadgeClass(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Trip Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Trip</h5>
                <button
                  className="btn btn-light"
                  onClick={() => setShowAddModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={newTrip.title}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, title: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Destination"
                  value={newTrip.destination}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, destination: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newTrip.startDate}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, startDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newTrip.endDate}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, endDate: e.target.value })
                  }
                />
                <textarea
                  rows="3"
                  className="form-control mb-2"
                  placeholder="Itinerary"
                  value={newTrip.itinerary}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, itinerary: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleAddTrip}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedTrip && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTrip.title}</h5>
                <button
                  className="btn btn-light"
                  onClick={() => setSelectedTrip(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Destination:</strong> {selectedTrip.destination}
                </p>
                <p>
                  <strong>Dates:</strong>{" "}
                  {selectedTrip.startDate?.slice(0, 10)} -{" "}
                  {selectedTrip.endDate?.slice(0, 10)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${getBadgeClass(selectedTrip.status)}`}
                  >
                    {selectedTrip.status}
                  </span>
                </p>
                <p>
                  <strong>Itinerary:</strong>
                </p>
                <p>{selectedTrip.itinerary}</p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedTrip._id, "completed")
                    }
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedTrip._id, "wishlist")
                    }
                  >
                    Save to Wishlist
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedTrip._id, "cancelled")
                    }
                  >
                    Cancel Trip
                  </button>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedTrip(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getBadgeClass(status) {
  switch (status) {
    case "completed":
      return "bg-success";
    case "cancelled":
      return "bg-danger";
    case "wishlist":
      return "bg-warning text-dark";
    default:
      return "bg-primary";
  }
}

export default MyTrips;
