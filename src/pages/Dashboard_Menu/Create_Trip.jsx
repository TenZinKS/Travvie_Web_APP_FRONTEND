import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked";
import "./Create_Trip.css";

function Create_Trip() {
  const [phase, setPhase] = useState("form");
  const [formData, setFormData] = useState({
    destination: "",
    people: "",
    startDate: "",
    endDate: "",
    tourType: "",
  });
  const [messages, setMessages] = useState([]);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [refineMode, setRefineMode] = useState(false);

  const chatRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleFormSubmit = async () => {
    const userPrompt = `Plan me a ${formData.tourType} trip for ${formData.people} people to ${formData.destination} from ${formData.startDate} to ${formData.endDate}.`;

    const initialMessages = [
      { role: "user", content: userPrompt }
    ];

    setMessages([{ sender: "user", text: userPrompt }]);
    setPhase("chat");

    await sendMessageToAI(initialMessages, false);
  };

  const sendMessageToAI = async (messagesToSend, isRefinement) => {
    setLoading(true);

    try {
      const payload = {
        messages: messagesToSend,
        refine: isRefinement,
        existingTrip: isRefinement ? tripData : null,
      };

      const res = await axios.post(
        "http://localhost:4000/api/deepseek-chat",
        payload
      );

      const aiReply = res.data.reply;

      // For first generation, parse trip JSON
      if (!isRefinement) {
        // Always save the itinerary as raw markdown for consistency
        const parsedTrip = {
          title: "Custom Trip",
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          itinerary: aiReply, // save raw markdown
        };
        setTripData(parsedTrip);
        setRefineMode(true);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: aiReply },
      ]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate trip.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserChatSubmit = async () => {
    if (!userInput.trim()) return;

    const newUserMsg = { role: "user", content: userInput };

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userInput },
    ]);

    const allMsgs = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    await sendMessageToAI([...allMsgs, newUserMsg], true);

    setUserInput("");
  };

  const handleSaveTrip = async () => {
    try {
      await axios.post("http://localhost:4000/api/trips", {
        ...tripData,
        userId: user.id,
      });
      alert("Trip saved!");
      resetToForm();
    } catch (error) {
      alert("Failed to save trip.");
    }
  };

  const resetToForm = () => {
    setPhase("form");
    setFormData({
      destination: "",
      people: "",
      startDate: "",
      endDate: "",
      tourType: "",
    });
    setMessages([]);
    setTripData(null);
    setRefineMode(false);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">Create a Trip</h3>

      {phase === "form" && (
        <div className="card p-4 shadow-sm">
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Number of People"
              value={formData.people}
              onChange={(e) =>
                setFormData({ ...formData, people: e.target.value })
              }
            />
          </div>
          <div className="mb-3 d-flex gap-2">
            <input
              type="date"
              className="form-control"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <input
              type="date"
              className="form-control"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={formData.tourType}
              onChange={(e) =>
                setFormData({ ...formData, tourType: e.target.value })
              }
            >
              <option value="">Select Tour Type</option>
              <option value="solo">Solo</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={handleFormSubmit}
          >
            Generate Trip
          </button>
        </div>
      )}

      {phase === "chat" && (
        <>
          <div ref={chatRef} className="chat-window mb-3">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.sender}`}>
                <div
                  className={`chat-bubble ${m.sender}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      m.sender === "assistant"
                        ? marked.parse(m.text)
                        : `<p>${m.text}</p>`,
                  }}
                />
              </div>
            ))}
            {loading && (
              <div className="chat-row assistant">
                <div className="chat-bubble assistant">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder={
                refineMode
                  ? "Ask to refine your trip (other topics won't be answered)."
                  : "Generating initial plan..."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUserChatSubmit();
              }}
              disabled={loading || !refineMode}
            />
            <button
              className="btn btn-primary"
              onClick={handleUserChatSubmit}
              disabled={loading || !refineMode}
            >
              Send
            </button>
          </div>

          {tripData && (
            <div className="text-center mt-3">
              <button
                className="btn btn-success me-2"
                onClick={handleSaveTrip}
              >
                Save Trip
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetToForm}
              >
                Start Over
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Create_Trip;
