import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../Styling/SearchBar.css'

export const SearchBar = () => {
  const [input, setInput] = useState("");

  const fetchApi = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase())
        );
        console.log(filteredData); // Replace with your desired logic
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleChange = (value) => {
    setInput(value);
    fetchApi(value);
  };

  return (
    <>
     <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        type="text"
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)} // Fixed prop
      />
    </div>
    </>
  );
};
