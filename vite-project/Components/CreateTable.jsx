import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { SearchBar } from "./SearchBar";
import { EditModal } from "./EditModal"; 
import "../Styling/CreateTable.css";

export const CreateTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(""); 
  const [username, setUsername] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch user details (role and username) from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUserRole(decoded.role);
        setUsername(decoded.username);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // ✅ Fetch Data when the component loads
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // ✅ Ensure token is defined
      if (!token) {
        console.error("No token found, redirecting to login.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/get-details", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setData(response.data.data || []);
        setFilteredData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Delete Click
  const handleDeleteClick = async (id) => {
    const token = localStorage.getItem("token"); // ✅ Get token inside function

    if (userRole === "employee") {
      alert("You are not authorized to delete the record.");
      return;
    }

    if (!token) {
      alert("No token found, please login again.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/delete-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` } 
      });

      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
      alert("Record deleted successfully!");
    } catch (err) {
      console.error("Error deleting data:", err);
      alert("Failed to delete the record. Please try again.");
    }
  };

  // ✅ Handle Search with Token
  const handleSearch = async (searchQuery) => {
    const token = localStorage.getItem("token"); // ✅ Ensure token is defined

    if (!token) {
      alert("No token found, please login again.");
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/search-details?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFilteredData(response.data.data);
    } catch (err) {
      console.error("Error searching:", err);
      alert("Search failed. Please try again.");
    }
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
              {(user.username === username || userRole === "admin") ? (
                <td>{user.phone}</td>
              ) : (
                <td>Hidden</td>
              )}
              <td>{user.startdate}</td>
              <td>
                {user.username === username || userRole === "admin" ? (
                  <button className="edit-btn" onClick={() => setSelectedUser(user) || setShowModal(true)}>
                    Edit
                  </button>
                ) : (
                  <button className="edit-btn" disabled>No Access</button>
                )}
                {userRole === "admin" && (
                  <button className="delete-btn" onClick={() => handleDeleteClick(user._id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
