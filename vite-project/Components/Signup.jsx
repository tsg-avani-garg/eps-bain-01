import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role set to employee
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!username) {
      validationErrors.username = "Email is required.";
    } else if (!validateEmail(username)) {
      validationErrors.username = "Invalid email format.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      validationErrors.password =
        "Password must be at least 8 characters, contain uppercase, lowercase, a number, and a special character.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        username,
        password,
        role,
      });
      console.log("Signup successful:", response.data);
      alert("Signup successful.");
      navigate("/login");
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
          type="Email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <label htmlFor="role">Choose your Role:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
        </select>

        <button type="submit" className="button">Register</button>
      </form>

      <p>
        Already a Member?{" "}
        <span className="link" onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
}
