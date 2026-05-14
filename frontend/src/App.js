import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import LocationPicker from "./components/LocationPicker";

const socket = io("http://localhost:5000");

function App() {

  // ---------------- STATES ----------------

  const [user, setUser] = useState(null);

  const [trips, setTrips] = useState([]);

  const [requests, setRequests] = useState([]);

  const [message, setMessage] = useState("");

  const [chatUser, setChatUser] = useState(null);

  const [chat, setChat] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [destinationName, setDestinationName] =
    useState("");

  const [page, setPage] = useState("trips");

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    interests: ""
  });

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: ""
  });
const [editingProfile, setEditingProfile] = useState(false);

const [profileData, setProfileData] = useState({
  bio: "",
  age: "",
  gender: "",
  country: "",
  instagram: "",
  profilePic: ""
});

const [attractions, setAttractions] = useState([]);
const [placeName, setPlaceName] = useState("");
  // ---------------- SOCKET JOIN ----------------

  useEffect(() => {

    if (user) {
      socket.emit("join", user._id);
    }

  }, [user]);

  // ---------------- RECEIVE LIVE CHAT ----------------

  useEffect(() => {

    socket.on("receive-message", (data) => {

      setChat(prev => [...prev, data]);

    });

    return () => socket.off("receive-message");

  }, []);

  // ---------------- ONLINE USERS ----------------

  useEffect(() => {

    socket.on("online-users", (users) => {

      setOnlineUsers(users);

    });

    return () => socket.off("online-users");

  }, []);

  // ---------------- AUTH ----------------

  const register = async () => {

    await axios.post(
      "http://localhost:5000/api/auth/register",
      auth
    );

    alert("Registered Successfully");
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

      alert(err.response?.data || "Login Failed");
    }
  };
const saveProfile = () => {

  setUser({
    ...user,
    ...profileData
  });

  setEditingProfile(false);

  alert("Profile Updated");
};
  // ---------------- LOAD TRIPS ----------------

  const loadTrips = () => {

    axios
      .get("http://localhost:5000/api/trips/all")
      .then(res => setTrips(res.data));
  };

  // ---------------- CREATE TRIP ----------------

  const createTrip = async () => {

    await axios.post(
      "http://localhost:5000/api/trips/create",
      {
        ...form,
        destination: destinationName,
        userId: user._id,
        interests: form.interests.split(","),
        location: selectedLocation,
        destinationName
      }
    );

    loadTrips();

    alert("Trip Created");
  };

  // ---------------- FIND NEARBY ----------------

  const findNearby = async () => {

    if (!selectedLocation) {
      alert("Select location first");
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/api/trips/nearby/${selectedLocation.lat}/${selectedLocation.lng}`
    );

    setTrips(res.data);
  };

  // ---------------- SEND REQUEST ----------------

  const sendRequest = async (trip) => {

    await axios.post(
      "http://localhost:5000/api/requests/send",
      {
        fromUser: user._id,
        toUser: trip.userId,
        tripId: trip._id
      }
    );

    alert("Request Sent");
  };

  // ---------------- LOAD REQUESTS ----------------

  const loadRequests = () => {

    axios
      .get(
        `http://localhost:5000/api/requests/${user?._id}`
      )
      .then(res => setRequests(res.data));
  };

  // ---------------- ACCEPT REQUEST ----------------

  const acceptRequest = async (id) => {

    await axios.put(
      `http://localhost:5000/api/requests/accept/${id}`
    );

    loadRequests();
  };

  // ---------------- REJECT REQUEST ----------------

  const rejectRequest = async (id) => {

    await axios.put(
      `http://localhost:5000/api/requests/reject/${id}`
    );

    loadRequests();
  };

  // ---------------- LOAD CHAT ----------------

  const loadChat = (otherUser) => {

    if (!otherUser) {
      alert("Invalid User");
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

        alert("Failed To Load Chat");
      });
  };

  // ---------------- SEND MESSAGE ----------------

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
const [darkMode, setDarkMode] = useState(false);
  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {

    if (user) {

      loadTrips();

      loadRequests();
    }

  }, [user]);

  // ---------------- LOGIN PAGE ----------------

  if (!user) {

    return (

      <div className="main-container">

        <div className="card">

          <h1>🌍 Travel Buddy Finder</h1>

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
            type="password"
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

      </div>
    );
  }

  // ---------------- MAIN UI ----------------

  return (

    <div className={darkMode ? "main-container dark" : "main-container"}>

      {/* NAVBAR */}

    {/* TOP NAVBAR */}

{/* TOP NAVBAR */}

<div className="navbar">

  <h1>🌍 Travel Buddy</h1>

  <div className="nav-right">

    {/* PROFILE */}

  <div
  className="profile-box"
  onClick={() => setEditingProfile(true)}
>

  <img
    src={
      user.profilePic ||
      profileData.profilePic ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
    alt="profile"
    className="profile-pic"
  />

  <div className="profile-info">

    <span>{user.name}</span>

    <small>
      {profileData.country || "Traveler"}
    </small>

  </div>

</div>

    {/* DARK MODE */}
<button
  className="edit-profile-btn"
  onClick={() => setEditingProfile(true)}
>
  Profile
</button>
    <button
      className="dark-toggle"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>

  </div>

</div>
      {/* ---------------- TRIPS PAGE ---------------- */}

      {page === "trips" && (

        <>

          {/* CREATE TRIP */}

          <div className="card">

            <h2>Create Trip</h2>

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
  setAttractions={setAttractions}
  setPlaceName={setPlaceName}
  darkMode={darkMode}
/>

{/* SELECTED PLACE DETAILS */}

{placeName && (

  <div className="selected-place-card">

    <h3>{placeName}</h3>

    <p>{destinationName}</p>

    {selectedLocation && (
      <p>
        Latitude: {selectedLocation.lat.toFixed(4)} |
        Longitude: {selectedLocation.lng.toFixed(4)}
      </p>
    )}

    {attractions.length > 0 && (

      <div className="attractions-box">

        <h4>Top Tourist Attractions</h4>

        {attractions.map((place, index) => (

          <div
            key={index}
            className="attraction-item"
          >
            📍 {place.name}

<br />

<small>
  Lat: {Number(place.lat).toFixed(4)} |
  Lng: {Number(place.lon).toFixed(4)}
</small>
          </div>

        ))}

      </div>

    )}

  </div>

)}

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

          <div className="trip-grid">

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

                {t.userId !== user._id && (

                  <button
                    onClick={() => sendRequest(t)}
                  >
                    Connect
                  </button>

                )}

              </div>

            ))}

          </div>

        </>

      )}

      {/* ---------------- REQUESTS PAGE ---------------- */}

      {page === "requests" && (

        <>

          <h2>Requests</h2>

          {requests.map(r => (

            <div className="card" key={r._id}>

             <p>{r.fromUser?.name}</p>

              <p>
                {onlineUsers.includes(r.fromUser?._id)
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
                  onClick={() => {

                    loadChat(
                      r.fromUser === user._id
                        ? r.toUser
                        : r.fromUser
                    );

                    setPage("chat");

                  }}
                >
                  Open Chat 💬
                </button>

              )}

            </div>

          ))}

        </>

      )}

      {/* ---------------- CHAT PAGE ---------------- */}

      {page === "chat" && (

        <>

          {chatUser ? (

            <div className="card">

              <h3>Chat</h3>

              <div className="chat-box">

                {chat.map(c => (

                  <div
                    key={c._id || Math.random()}
                    className={
                      c.sender === user._id
                        ? "chat-message you"
                        : "chat-message them"
                    }
                  >

                    {c.message}

                  </div>

                ))}

              </div>

              <input
                value={message}
                placeholder="Type message..."
                onChange={e =>
                  setMessage(e.target.value)
                }
              />

              <button onClick={sendMessage}>
                Send
              </button>

            </div>

          ) : (

            <div className="card">

              <h3>
                Open a chat from Requests page
              </h3>

            </div>

          )}

        </>

      )}

     {editingProfile && (

  <div className="profile-modal">

    <div className="profile-card">

      <img
        src={
          profileData.profilePic ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="profile"
        className="big-profile-pic"
      />

      <h2>{user.name}</h2>

      <p>{profileData.bio}</p>

      <div className="profile-details">

        <p><b>Age:</b> {profileData.age}</p>

        <p><b>Gender:</b> {profileData.gender}</p>

        <p><b>Country:</b> {profileData.country}</p>

        <p><b>Instagram:</b> @{profileData.instagram}</p>

      </div>

      <hr />

      <h3>Edit Profile</h3>

      <input
        placeholder="Profile Image URL"
        onChange={e =>
          setProfileData({
            ...profileData,
            profilePic: e.target.value
          })
        }
      />

      <input
        placeholder="Bio"
        onChange={e =>
          setProfileData({
            ...profileData,
            bio: e.target.value
          })
        }
      />

      <input
        placeholder="Age"
        onChange={e =>
          setProfileData({
            ...profileData,
            age: e.target.value
          })
        }
      />

      <input
        placeholder="Gender"
        onChange={e =>
          setProfileData({
            ...profileData,
            gender: e.target.value
          })
        }
      />

      <input
        placeholder="Country"
        onChange={e =>
          setProfileData({
            ...profileData,
            country: e.target.value
          })
        }
      />

      <input
        placeholder="Instagram Username"
        onChange={e =>
          setProfileData({
            ...profileData,
            instagram: e.target.value
          })
        }
      />

      <button onClick={saveProfile}>
        Save Profile
      </button>

      <button
        onClick={() => setEditingProfile(false)}
      >
        Close
      </button>

    </div>

  </div>

)}
      {/* BOTTOM NAVIGATION */}

<div className="bottom-nav">

  <button
    onClick={() => setPage("trips")}
  >
    Trips
  </button>

  <button
    onClick={() => setPage("requests")}
  >
    Requests
  </button>

  <button
    onClick={() => setPage("chat")}
  >
    Chat
  </button>



</div>

      {/* LOGOUT */}

      <button
        className="logout-btn"
        onClick={() => {

          localStorage.clear();

          setUser(null);

        }}
      >
        Logout
      </button>

    </div>
  );
}

export default App;