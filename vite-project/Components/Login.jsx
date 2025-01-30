import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode as jwt_decode} from "jwt-decode"; // Corrected import
import "../Styling/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password,
      });

      console.log("Login successful:", response.data);
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem("token", token);

      // Decode token to extract user details
      const decoded = jwt_decode(token);
      console.log("Decoded token:", decoded);

      // Store username and role for easy access
      localStorage.setItem("username", decoded.username);
      localStorage.setItem("role", decoded.role);

      // Check token expiration
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      // Role-based redirection
      if (decoded.role === "admin") {
        navigate("/add-details"); // Full access for admin
      } else if (decoded.role === "employee") {
        navigate("/add-details?mode=employee"); // Limited access for employees
      } else {
        alert("Unauthorized role. Please contact support.");
        localStorage.clear();
      }

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="form">
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <a href="#">Forgot password</a>
        <button type="submit" className="button">Login</button>
      </form>
      <p>
        Not a Member?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Signup now
        </span>
      </p>
    </div>
  );
}
