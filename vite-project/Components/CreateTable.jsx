import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { SearchBar } from "./SearchBar"; // Import the SearchBar component
import "../Styling/CreateTable.css";

export const CreateTable = () => {
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [data, setData] = useState([]); // State to store full data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [editing, setEditing] = useState(null); // State to track which row is being edited
  const [editedData, setEditedData] = useState({}); // State to store edited row data

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
    setEditing(user._id);
    setEditedData(user);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/update-details/${editing}`, editedData);

      const updatedData = data.map((item) =>
        item._id === editing ? editedData : item
      );
      setData(updatedData);
      setFilteredData(updatedData); // Update the filtered data
      setEditing(null);
      alert("Details updated successfully!");
    } catch (err) {
      console.error("Error updating data:", err);
      alert("Failed to update details. Please try again.");
    }
  };

  const handleDeleteClick = async (id) => {
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

      {/* Replace manual search bar with SearchBar.jsx */}
      <SearchBar setFilteredData={handleSearch} />

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Start Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user) => (
            <tr key={user._id}>
              {editing === user._id ? (
                <>
                  {/* Editable Row */}
                  <td>{user._id}</td>
                  <td>
                    <input
                      type="text"
                      name="firstname"
                      value={editedData.firstname}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastname"
                      value={editedData.lastname}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="department"
                      value={editedData.department}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="designation"
                      value={editedData.designation}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="startdate"
                      value={editedData.startdate}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button className="save-btn" onClick={handleSaveClick}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  {/* Non-Editable Row */}
                  <td>{user._id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.department}</td>
                  <td>{user.designation}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.startdate}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
