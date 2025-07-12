import { useEffect, useState } from "react";
import axios from "axios";
import { marked } from "marked";
import { useSearchParams } from "react-router-dom";

function My_Trips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    from: "",
    destination: "",
    startDate: "",
    endDate: "",
    itinerary: "",
  });

  const [newTrip, setNewTrip] = useState({
    title: "",
    from: "",
    destination: "",
    startDate: "",
    endDate: "",
    itinerary: "",
    status: "planned",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    const paramStatus = searchParams.get("status");
    if (paramStatus) {
      setStatusFilter(paramStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [trips, searchTerm, statusFilter]);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/trips/user/${user.id}`
      );
      const nonWishlistTrips = res.data.filter(
        (t) => t.status !== "wishlist"
      );
      setTrips(nonWishlistTrips);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch trips.");
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(term) ||
          t.from?.toLowerCase().includes(term) ||
          t.destination?.toLowerCase().includes(term) ||
          t.itinerary?.toLowerCase().includes(term)
      );
    }

    setFilteredTrips(filtered);
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
        from: "",
        destination: "",
        startDate: "",
        endDate: "",
        itinerary: "",
        status: "planned",
      });
      fetchTrips();
      alert("Trip added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add trip.");
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
      alert("Failed to update trip status.");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/trips/${tripId}`);
      fetchTrips();
      alert("Trip deleted.");
      setSelectedTrip(null);
    } catch (err) {
      alert("Failed to delete trip.");
    }
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    setEditFormData({
      title: trip.title || "",
      from: trip.from || "",
      destination: trip.destination || "",
      startDate: trip.startDate?.slice(0, 10) || "",
      endDate: trip.endDate?.slice(0, 10) || "",
      itinerary: trip.itinerary || "",
    });
  };

  const handleUpdateTrip = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/trips/${editingTrip._id}`,
        editFormData
      );
      alert("Trip updated successfully!");
      setEditingTrip(null);
      fetchTrips();
    } catch (err) {
      console.error(err);
      alert("Failed to update trip.");
    }
  };

  const handleMarkAsUpcoming = async (tripId) => {
    if (
      window.confirm(
        "⚠️ Once this trip is marked as upcoming, it cannot be deleted. Proceed?"
      )
    ) {
      await handleStatusChange(tripId, "upcoming");
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

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, from, destination, or itinerary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="text-center text-muted">No trips found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>From</th>
              <th>Destination</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.title}</td>
                <td>{trip.from}</td>
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
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    View Details
                  </button>

                  {!["completed", "cancelled"].includes(trip.status) && (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => openEditModal(trip)}
                      >
                        Edit
                      </button>

                      {trip.status === "planned" && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTrip(trip._id)}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <TripFormModal
          title="Add New Trip"
          tripData={newTrip}
          setTripData={setNewTrip}
          onSave={handleAddTrip}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedTrip(null)}
          onMarkAsUpcoming={handleMarkAsUpcoming}
        />
      )}

      {editingTrip && (
        <TripFormModal
          title={`Edit Trip: ${editingTrip.title}`}
          tripData={editFormData}
          setTripData={setEditFormData}
          onSave={handleUpdateTrip}
          onClose={() => setEditingTrip(null)}
          previewMarkdown
        />
      )}
    </div>
  );
}

function TripDetailsModal({
  trip,
  onStatusChange,
  onClose,
  onMarkAsUpcoming,
}) {
  const isReadonly = ["completed", "cancelled"].includes(trip.status);

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{trip.title}</h5>
            <button className="btn btn-light" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>
              <strong>From:</strong> {trip.from}
            </p>
            <p>
              <strong>Destination:</strong> {trip.destination}
            </p>
            <p>
              <strong>Dates:</strong>{" "}
              {trip.startDate?.slice(0, 10)} - {trip.endDate?.slice(0, 10)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge ${getBadgeClass(trip.status)}`}>
                {trip.status}
              </span>
            </p>
            <p>
              <strong>Itinerary:</strong>
            </p>
            <div
              className="border p-2 bg-light"
              dangerouslySetInnerHTML={{
                __html: marked.parse(trip.itinerary || ""),
              }}
            ></div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            {!isReadonly ? (
              <div className="d-flex gap-2">
                {trip.status === "planned" && (
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => onMarkAsUpcoming(trip._id)}
                  >
                    Mark as Upcoming
                  </button>
                )}

                {trip.status !== "planned" && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => onStatusChange(trip._id, "completed")}
                    >
                      Mark as Completed
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onStatusChange(trip._id, "wishlist")}
                    >
                      Save to Wishlist
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onStatusChange(trip._id, "cancelled")}
                    >
                      Cancel Trip
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted m-0">
                This trip cannot be modified.
              </p>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripFormModal({
  title,
  tripData,
  setTripData,
  onSave,
  onClose,
  previewMarkdown,
}) {
  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn btn-light" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Title"
              value={tripData.title}
              onChange={(e) =>
                setTripData({ ...tripData, title: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              placeholder="From"
              value={tripData.from}
              onChange={(e) =>
                setTripData({ ...tripData, from: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              placeholder="Destination"
              value={tripData.destination}
              onChange={(e) =>
                setTripData({ ...tripData, destination: e.target.value })
              }
            />
            <input
              type="date"
              className="form-control mb-2"
              value={tripData.startDate}
              onChange={(e) =>
                setTripData({ ...tripData, startDate: e.target.value })
              }
            />
            <input
              type="date"
              className="form-control mb-2"
              value={tripData.endDate}
              onChange={(e) =>
                setTripData({ ...tripData, endDate: e.target.value })
              }
            />
            <textarea
              rows="4"
              className="form-control mb-2"
              placeholder="Itinerary"
              value={tripData.itinerary}
              onChange={(e) =>
                setTripData({ ...tripData, itinerary: e.target.value })
              }
            ></textarea>

            {previewMarkdown && (
              <>
                <p className="mt-3">
                  <strong>Preview:</strong>
                </p>
                <div
                  className="border p-2 bg-light"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(tripData.itinerary || ""),
                  }}
                />
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={onSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
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
    case "upcoming":
      return "bg-info text-white";
    default:
      return "bg-primary";
  }
}

export default My_Trips;
