import React, { useState } from "react";
import axios from "axios";
import "../Styling/EditModal.css";

export const EditModal = ({ user, onClose, isAdmin, username }) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    department: user.department,
    designation: user.designation,
    username: user.username,
    phone: user.phone,
    startdate: user.startdate,
  });

  const loggedInUsername = localStorage.getItem("username");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        validationErrors[key] = "This field is required";
      }
    });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.username)) {
      validationErrors.username = "Username must be a valid email address";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRestrictedFieldClick = (fieldName) => {
    alert(`Access Denied: The "${fieldName}" field is only accessible to admins.`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const timestamp = new Date().toISOString(); // Get current time
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication error: Token missing. Please log in again.");
        return;
      }

      // Prepare updated data
      const updatedFormData = {
        ...formData,
        updated_at: timestamp,
        changed_by: loggedInUsername, // Store username in the database
      };

      // Make API request with Authorization header
      const response = await axios.post(
        "http://127.0.0.1:8000/upsert-details",
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      onClose();
    } catch (err) {
      console.error("Error saving data:", err.response?.data || err.message);
      alert("Failed to save details. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Employee Details</h2>
        
        {Object.keys(errors).map((field) => (
          <p key={field} className="error-message">{errors[field]}</p>
        ))}

        {Object.keys(formData).map((field) => (
          <div key={field} className={!isAdmin && field !== "phone" ? "restricted-field" : ""}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === "startdate" ? "date" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              disabled={!isAdmin && field !== "phone"}
            />
            {errors[field] && <span className="error-text">{errors[field]}</span>}
          </div>
        ))}

        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
