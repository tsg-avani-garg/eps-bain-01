import React, { useState } from "react";
import axios from "axios";
import "../Styling/AddBtn.css";

export const AddBtn = () => {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    department: "",
    designation: "",
    username: "",
    phone: "",
    startdate: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value }); // Correctly update state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values); // Debugging: Log values

    try {
      // Post data to the /add-details endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/add-details", // Replace with your backend URL
        values
      );

      console.log("Data submitted successfully:", response.data);
      alert("Details added successfully!");

      setValues({
        firstname: "",
        lastname: "",
        department: "",
        designation: "",
        username: "",
        phone: "",
        startdate: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
      alert("Failed to add details. Please try again.");
    }
  };

  return (
    <>
      <h2>Add Employee Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">First Name:</label>
        <input
          type="text"
          placeholder="Enter First Name"
          name="firstname"
          onChange={handleChange}
          value={values.firstname}
        />

        <label htmlFor="lastname">Last Name:</label>
        <input
          type="text"
          placeholder="Enter Last Name"
          name="lastname"
          onChange={handleChange}
          value={values.lastname}
        />

        <label htmlFor="department">Department:</label>
        <input
          type="text"
          placeholder="Enter your department"
          name="department"
          onChange={handleChange}
          value={values.department}
        />

        <label htmlFor="designation">Designation:</label>
        <input
          type="text"
          placeholder="Enter your Designation"
          name="designation"
          onChange={handleChange}
          value={values.designation}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          placeholder="Enter your Username"
          name="username"
          onChange={handleChange}
          value={values.email}
        />

        <label htmlFor="phone">Phone Number:</label>
        <input
          type="text"
          placeholder="Enter your Number"
          name="phone"
          onChange={handleChange}
          value={values.phone}
        />

        <label htmlFor="startdate">Start Date:</label>
        <input
          type="date"
          placeholder="Enter Start Date"
          name="startdate"
          onChange={handleChange}
          value={values.startdate}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};
