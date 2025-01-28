import React, { useState } from "react";
import { AddBtn } from "./AddBtn";
import { CreateTable } from "./CreateTable";
import "../Styling/EmpManage.css";

export const EmpManage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddClick = () => {
    setShowAddForm(true); // Show the AddBtn component
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    // Implement your logout logic here (e.g., redirect to login page)
  };

  return (
    <div className="container">
      <div className="header-container">
        <div className="button-container">
          <button className="add-btn" onClick={handleAddClick}>
            Add
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="content-container">
        {showAddForm ? <AddBtn /> : <CreateTable />}
      </div>
    </div>
  );
};
