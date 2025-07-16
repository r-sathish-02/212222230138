import React, { useState } from "react";
import axios from "axios";
import "./StatsPage.css";

const StatsView = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const handleFetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
      setStats(res.data);
      setError("");
    } catch (err) {
      setStats(null);
      setError("Shortcode not found or server error.");
    }
  };
  return (
    <div className="stats-page">
      <h2>URL Statistics</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <button onClick={handleFetchStats}>Get Stats</button>
      </div>
      {error && <p className="error">{error}</p>}
      {stats && (
        <div className="stats-result">
          <p><strong>Original URL:</strong> {stats.url}</p>
          <p><strong>Shortcode:</strong> {stats.shortcode}</p>
          <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
          <p><strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}</p>
          <p><strong>Total Clicks:</strong> {stats.totalClicks}</p>
          <div className="click-details">
            <strong>Click Details:</strong>
            <ul>
              {stats.clickDetails.map((click, i) => (
                <li key={i}>
                  {new Date(click.timestamp).toLocaleString()} — {click.location} (referrer: {click.referrer})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default StatsView;
