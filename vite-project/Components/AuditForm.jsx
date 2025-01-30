import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styling/AuditForm.css";

export const AuditForm = () => {
  const [logs, setLogs] = useState([]); // State to store audit logs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch audit logs from FastAPI backend
    axios
      .get("http://127.0.0.1:8000/get-audit-logs")
      .then((res) => {
        setLogs(res.data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching audit logs:", err);
        setError("Failed to fetch audit logs. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="audit-form-container">
      <h2>Audit Logs</h2>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Changed By</th>
            <th>Record ID</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.changed_by}</td>
              <td>{log.record_id}</td>
              <td>
                <ul>
                  {Object.entries(log.changes).map(([field, change]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {change.old} → {change.new}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
