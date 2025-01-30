import React, { useState, useEffect } from "react";
import { CreateTable } from "./CreateTable";
import { EditModal } from "./EditModal"; // Import the modal component
import "../Styling/EmpManage.css";

export const EmpManage = () => {
  const [userRole, setUserRole] = useState(null); // Store user role
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [newUser, setNewUser] = useState(null); // Store new entry data

  useEffect(() => {
    // Get the user role from the token (assuming it's stored in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUserRole(decoded.role); // Extract and store the role
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
      }
    }
  }, []);

  const handleAddClick = () => {
    if (userRole === "admin") {
      // Prepare an empty user object for adding a new entry
      setNewUser({
        firstname: "",
        lastname: "",
        department: "",
        designation: "",
        username: "",
        phone: "",
        startdate: "",
      });
      setShowModal(true); // Open the modal
    } else {
      // Show alert for unauthorized access
      alert("Access denied: Only admins can add new entries.");
    }
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem("token"); // Clear the token on logout
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <>
      <div className="header-container">
        <div className="button-container">
          {/* Open modal instead of navigating */}
          <button className="add-btn" onClick={handleAddClick}>
            Add
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="content-container">
        <CreateTable />
      </div>

      {/* Render EditModal when showModal is true */}
      {showModal && (
        <EditModal
          user={newUser} // Pass empty user data for new entry
          onClose={() => setShowModal(false)}
          isAdmin={true} // Since only admins can add, set to true
          username=""
        />
      )}
    </>
  );
};
