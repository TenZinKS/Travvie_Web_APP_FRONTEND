import { useEffect, useState } from "react";
import axios from "axios";

function Saved_Trips() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    from: "",
    destination: "",
    startDate: "",
    endDate: "",
    itinerary: "",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/trips/user/${user.id}`
      );
      const wishlistTrips = res.data.filter(
        (trip) => trip.status === "wishlist"
      );
      setTrips(wishlistTrips);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (tripId) => {
    try {
      await axios.put(`http://localhost:4000/api/trips/${tripId}`, {
        status: "planned",
      });
      fetchTrips();
      alert("Trip moved back to My Trips.");
    } catch (err) {
      alert("Failed to update trip.");
    }
  };

  const handleCancelTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await axios.put(`http://localhost:4000/api/trips/${tripId}`, {
        status: "cancelled",
      });
      fetchTrips();
      alert("Trip cancelled.");
    } catch (err) {
      alert("Failed to cancel trip.");
    }
  };

  const startEditing = (trip) => {
    setEditingTrip(trip);
    setEditForm({
      title: trip.title || "",
      from: trip.from || "",
      destination: trip.destination || "",
      startDate: trip.startDate?.slice(0, 10) || "",
      endDate: trip.endDate?.slice(0, 10) || "",
      itinerary: trip.itinerary || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/trips/${editingTrip._id}`,
        editForm
      );
      alert("Trip updated successfully!");
      setEditingTrip(null);
      fetchTrips();
    } catch (err) {
      alert("Failed to update trip.");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Saved Trips (Wishlist)</h3>

      {trips.length === 0 ? (
        <p>No trips in wishlist.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>From</th>
              <th>Destination</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.title}</td>
                <td>{trip.from}</td>
                <td>{trip.destination}</td>
                <td>
                  {trip.startDate?.slice(0, 10)} -{" "}
                  {trip.endDate?.slice(0, 10)}
                </td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleRemoveFromWishlist(trip._id)}
                    >
                      Move to My Trips
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => startEditing(trip)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancelTrip(trip._id)}
                    >
                      Cancel Trip
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingTrip && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Trip</h5>
                <button
                  className="btn btn-light"
                  onClick={() => setEditingTrip(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="From"
                  value={editForm.from}
                  onChange={(e) =>
                    setEditForm({ ...editForm, from: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Destination"
                  value={editForm.destination}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      destination: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      endDate: e.target.value,
                    })
                  }
                />
                <textarea
                  rows="3"
                  className="form-control mb-2"
                  placeholder="Itinerary"
                  value={editForm.itinerary}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      itinerary: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingTrip(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Saved_Trips;
