import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../Styling/SearchBar.css";

export const SearchBar = ({ setFilteredData }) => {
  const [input, setInput] = useState("");

  const fetchApi = (value) => {
    fetch(`http://127.0.0.1:8000/search-details?query=${value}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredData(data.data || []); // Update the filtered data in the parent
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleChange = (value) => {
    setInput(value);
    fetchApi(value); // Fetch results as the user types
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        type="text"
        placeholder="Type to search by name, designation, number, or date..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
