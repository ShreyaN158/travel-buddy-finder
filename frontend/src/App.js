import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import LocationPicker from "./components/LocationPicker";

const socket = io("http://localhost:5000");

function App() {

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: ""
  });

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

const [destinationName, setDestinationName] = useState("");

  // SOCKET JOIN
  useEffect(() => {
    if (user) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // RECEIVE LIVE MESSAGES
  useEffect(() => {

    socket.on("receive-message", (data) => {
      setChat(prev => [...prev, data]);
    });

    return () => socket.off("receive-message");

  }, []);

  // ONLINE USERS
  useEffect(() => {

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online-users");

  }, []);

  // AUTH
  const register = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/register",
      auth
    );

    alert("Registered");
  };

  const login = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        auth
      );

      setUser(res.data.user);

    } catch (err) {

      console.log(err);

      alert(err.response?.data || "Login failed");
    }
  };

  // LOAD TRIPS
  const loadTrips = () => {

    axios
      .get("http://localhost:5000/api/trips/all")
      .then(res => setTrips(res.data));
  };

  // CREATE TRIP
  const createTrip = async () => {

  await axios.post(
    "http://localhost:5000/api/trips/create",
    {
      ...form,
      userId: user._id,
      interests: form.interests.split(","),
      location: selectedLocation,
      destinationName
    }
  );

  loadTrips();
};

  // SEND REQUEST
  const sendRequest = async (trip) => {

    await axios.post(
      "http://localhost:5000/api/requests/send",
      {
        fromUser: user._id,
        toUser: trip.userId,
        tripId: trip._id
      }
    );

    alert("Request sent");
  };

  // LOAD REQUESTS
  const loadRequests = () => {

    axios
      .get(
        `http://localhost:5000/api/requests/${user?._id}`
      )
      .then(res => setRequests(res.data));
  };

  // ACCEPT REQUEST
  const acceptRequest = async (id) => {

    await axios.put(
      `http://localhost:5000/api/requests/accept/${id}`
    );

    loadRequests();
  };

  // REJECT REQUEST
  const rejectRequest = async (id) => {

    await axios.put(
      `http://localhost:5000/api/requests/reject/${id}`
    );

    loadRequests();
  };

  // LOAD CHAT
  const loadChat = (otherUser) => {

    if (!otherUser) {
      alert("Invalid user");
      return;
    }

    setChatUser(otherUser);

    axios
      .get(
        `http://localhost:5000/api/chat/${user._id}/${otherUser}`
      )
      .then(res => setChat(res.data))
      .catch(err => {

        console.log(err);

        alert("Failed to load chat");
      });
  };

  // SEND MESSAGE
  const sendMessage = async () => {

  if (!message) return;

  const msgData = {
    sender: user._id,
    receiver: chatUser,
    message
  };

  await axios.post(
    "http://localhost:5000/api/chat/send",
    msgData
  );

  socket.emit("send-message", msgData);

  setMessage("");
};

  const findNearby = async () => {

  const res = await axios.get(
    `http://localhost:5000/api/trips/nearby/${selectedLocation.lat}/${selectedLocation.lng}`
  );

  setTrips(res.data);
};
  // LOAD INITIAL DATA
  useEffect(() => {

    if (user) {
      loadTrips();
      loadRequests();
    }

  }, [user]);

  // LOGIN PAGE
  if (!user) {

    return (

      <div style={{ padding: 20 }}>

        <h1>Travel Buddy Finder</h1>

        <input
          placeholder="Name"
          onChange={e =>
            setAuth({
              ...auth,
              name: e.target.value
            })
          }
        />

        <input
          placeholder="Email"
          onChange={e =>
            setAuth({
              ...auth,
              email: e.target.value
            })
          }
        />

        <input
          placeholder="Password"
          onChange={e =>
            setAuth({
              ...auth,
              password: e.target.value
            })
          }
        />

        <button onClick={register}>
          Register
        </button>

        <button onClick={login}>
          Login
        </button>

      </div>
    );
  }

  // MAIN UI
  return (

    <div style={{ padding: 20 }}>

      <div className="navbar">

  <h1>
    🌍 Welcome {user.name}
  </h1>

</div>

      {/* CREATE TRIP */}

      <div className="card">

        <h2>Create Trip</h2>

        <input
          placeholder="Destination"
          onChange={e =>
            setForm({
              ...form,
              destination: e.target.value
            })
          }
        />

        <input
          type="date"
          onChange={e =>
            setForm({
              ...form,
              startDate: e.target.value
            })
          }
        />

        <input
          type="date"
          onChange={e =>
            setForm({
              ...form,
              endDate: e.target.value
            })
          }
        />

        <input
          placeholder="Interests"
          onChange={e =>
            setForm({
              ...form,
              interests: e.target.value
            })
          }
        />

<LocationPicker
  setSelectedLocation={setSelectedLocation}
  setDestinationName={setDestinationName}
/>
<button onClick={findNearby}>
  Find Nearby Travelers
</button>

<button
  onClick={() => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

      }
    );

  }}
>
  Use My Location
</button>
        <button onClick={createTrip}>
          Create
        </button>

      </div>

      {/* TRIPS */}

      <h2>Trips</h2>

     {trips.map(t => (

  <div className="card" key={t._id}>

    <h3>{t.destination}</h3>

    <p>{t.destinationName}</p>

    <iframe
      width="100%"
      height="250"
      style={{
        borderRadius: "15px",
        marginTop: "10px"
      }}
      loading="lazy"
      allowFullScreen
      src={`https://www.google.com/maps?q=${t.location?.lat},${t.location?.lng}&z=10&output=embed`}
    ></iframe>

    <button
      onClick={() => sendRequest(t)}
    >
      Connect
    </button>

  </div>
))}

      {/* REQUESTS */}

      <h2>Requests</h2>

      {requests.map(r => (

        <div className="card" key={r._id}>

          <p>{r.fromUser}</p>

          <p>
            {onlineUsers.includes(r.fromUser)
              ? "🟢 Online"
              : "⚫ Offline"}
          </p>

          <button
            onClick={() => acceptRequest(r._id)}
          >
            Accept
          </button>

          <button
            onClick={() => rejectRequest(r._id)}
          >
            Reject
          </button>

          {r.status === "accepted" && (

            <button
              onClick={() =>
                loadChat(
                  r.fromUser === user._id
                    ? r.toUser
                    : r.fromUser
                )
              }
            >
              Open Chat 💬
            </button>

          )}

        </div>
      ))}

      {/* CHAT */}

      {chatUser && (

        <div className="card">

          <h3>Chat</h3>

          {chat.map(c => (

            <p key={c._id || Math.random()}>

              <b>
                {c.sender === user._id
                  ? "You"
                  : "Them"}:
              </b>

              {" "}
              {c.message}

            </p>

          ))}

          <input
            value={message}
            onChange={e =>
              setMessage(e.target.value)
            }
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>
      )}
<div
  style={{
    marginTop: "40px",
    textAlign: "center"
  }}
>

  <button
    onClick={() => {
      localStorage.clear();
      setUser(null);
    }}
  >
    Logout
  </button>

</div>
    </div>
  );
}

export default App;

