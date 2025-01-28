import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signup({ toggleLogin }) {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("option1");
    const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        username,
        password // Hardcoded role value
      });
      console.log("Signup successful:", response.data);
      navigate("/add-details");
      // Handle success (e.g., redirect, show success message)
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert("Signup failed. Please check your details.");
    }
  };

  return (
    <div className="form">
      <h2>Signup Form</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text" // Changed from "email" to "text"
          placeholder="Username" // Changed placeholder from "Email" to "Username"
          value={username} // Updated to bind to the username state
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <label htmlFor="options">Choose your Role:</label>
        <select
          id="options"
          name="options"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="option1">Employee</option>
          {/* <option value="option2">Admin</option> */}
        </select>
        <button type="submit" className="button">Register</button>
      </form>
      <p>
        Already a Member?{" "}
        <span className="link" onClick={toggleLogin}>
          Login here
        </span>
      </p>
    </div>
  );
}
