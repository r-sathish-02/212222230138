import React, { useState } from "react";
import axios from "axios";
import "./ShortnerForm.css";

export const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/shorten", { url });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert("Failed to shorten URL");
    }
  };
  return (
    <div className="shortener-form">
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </p>
      )}
    </div>
  );
};
export const StatsViewer = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);
  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      alert("Failed to fetch stats");
    }
  };
  return (
    <div className="stats-viewer">
      <h2>URL Stats Viewer</h2>
      <input
        type="text"
        placeholder="Enter shortcode"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={fetchStats}>Get Stats</button>
      {stats && (
        <div className="stats-result">
          <p><strong>Original URL:</strong> {stats.url}</p>
          <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
          <p><strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}</p>
          <p><strong>Total Clicks:</strong> {stats.totalClicks}</p>
          <ul>
            {stats.clickDetails.map((click, i) => (
              <li key={i}>
                {new Date(click.timestamp).toLocaleString()} — {click.location} (ref: {click.referrer})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
