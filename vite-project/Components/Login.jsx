import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { EmpManage } from "./EmpManage";

export default function Login({ toggleSignup }) {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password,
      });
      console.log("Login successful:", response.data);

      // Assuming you receive a token in the response
      const { token } = response.data;
      localStorage.setItem("token", token); // Store the token in localStorage
      const decoded = jwt_decode(token);
      console.log("Decoded token:", decoded);

      if (decoded.role === "admin") {
        // Navigate to add-details if the user is an admin
        navigate("/add-details");
      } else if (decoded.role === "employee") {
        // Navigate to another page if the user is an employee
        navigate("/add-details?mode=employee"); // Replace with the desired employee route
      } else {
        // Handle unexpected roles
        alert("Unauthorized role. Please contact support.");
        localStorage.removeItem("token"); // Clear the token if the role is invalid
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      // Show an error message to the user
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="form">
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text" // Changed from "email" to "text"
          placeholder="Username" // Changed from "Email" to "Username"
          value={username} // Updated to bind to the username state
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a href="#">Forgot password</a>
        <button type="submit" className="button">Login</button>
      </form>
      <p>
        Not a Member?{" "}
        <span className="link" onClick={toggleSignup}>
          Signup now
        </span>
      </p>
    </div>
  );
}
