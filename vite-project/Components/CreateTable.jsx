import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { SearchBar } from "./SearchBar";
import { EditModal } from "./EditModal"; // Import the modal component
import "../Styling/CreateTable.css";

export const CreateTable = () => {
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [data, setData] = useState([]); // State to store full data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [userRole, setUserRole] = useState(""); // Store logged-in user role
  const [username, setUsername] = useState(""); // Store logged-in username
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user for editing

  // Fetch user details (role and username) from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUserRole(decoded.role); // Extract role
        setUsername(decoded.username); // Extract username
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // Fetch data when the component loads
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get-details")
      .then((res) => {
        setData(res.data.data || []); // Assuming response structure is { data: [...] }
        setFilteredData(res.data.data || []); // Initialize filtered data with full data
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleEditClick = (user) => {
    if (user.username === username || userRole === "admin") {
      setSelectedUser(user); // Set the selected user for editing
      setShowModal(true); // Show the modal
    } else {
      alert("Access denied: You can only edit your own details or must be an admin.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (userRole === "employee") {
      alert("You are not authorized to delete the record.");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-details/${id}`);
      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
      setFilteredData(updatedData); // Update the filtered data
      alert("Record deleted successfully!");
    } catch (err) {
      console.error("Error deleting data:", err);
      alert("Failed to delete the record. Please try again.");
    }
  };

  const handleSearch = (filteredResults) => {
    setFilteredData(filteredResults); // Update filtered data based on search results
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="table-container">
      <h2>Employee Details</h2>

      <SearchBar setFilteredData={handleSearch} />

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Username</th>
            <th>Contact Number</th>
            <th>Start Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.department}</td>
              <td>{user.designation}</td>
              <td>{user.username}</td>
              {/* Show Contact Number only if username matches or user is an admin */}
              {(user.username === username || userRole === "admin") ? (
                <td>{user.phone}</td>
              ) : (
                <td>Hidden</td>
              )}
              <td>{user.startdate}</td>
              <td>
                {/* Allow edit if username matches or user is admin */}
                {user.username === username || userRole === "admin" ? (
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                ) : (
                  <button className="edit-btn" disabled>
                    No Access
                  </button>
                )}
                {/* Show delete button only for admins */}
                {userRole === "admin" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Modal */}
      {showModal && (
        <EditModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          isAdmin={userRole === "admin"}
          username={username}
        />
      )}
    </div>
  );
};
