// src/App.js
import React, { useState, useEffect } from "react";
import { db } from "./db";

function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [photo, setPhoto] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch all users from the database on component mount
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await db.users.toArray();
      setUsers(allUsers);
    };
    fetchData();
  }, []);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());
      const imageDataUrl = canvas.toDataURL("image/png");
      setPhoto(imageDataUrl);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const handleSaveData = async () => {
    if (name && surname && photo) {
      await db.users.add({ name, surname, photo });
      alert("Data saved locally in IndexedDB!");

      // Clear input fields
      setName("");
      setSurname("");
      setPhoto(null);

      // Fetch updated data to display in the table
      const allUsers = await db.users.toArray();
      setUsers(allUsers);
    } else {
      alert("Please fill in all fields and capture a photo.");
    }
  };

  return (
    <div>
      <h1>PWA with Local Storage</h1>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Surname:
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleCapture}>Capture Image</button>
      {photo && <img src={photo} alt="Captured" width={100} />}
      <br />
      <button onClick={handleSaveData}>Save Data</button>

      <h2>Saved Users</h2>
      {users.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>
                  {user.photo && <img src={user.photo} alt="User" width={50} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default App;
