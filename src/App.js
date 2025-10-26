import React, { useState } from "react";
import "./App.css"; // Import the stylesheet

function App() {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMedia = async () => {
    setError("");
    setMedia([]);
    if (!url) {
      setError("Please enter an Instagram post URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5187/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "An unknown server error occurred.");
      } else {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch (e) {
      setError("Failed to contact backend. Is it running? (Check URL/CORS)");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    fetchMedia();
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Instagram Media Downloader</h1>
        <p>Paste the URL of a public post to download its images or videos.</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="url"
          placeholder="e.g., https://www.instagram.com/p/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button className="fetch-button" type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Fetch Media"}
        </button>
      </form>

      {loading && <div className="loader"></div>}
      {error && <p className="error-message">{error}</p>}

      <div className="media-grid">
        {media.map((m, idx) => (
          <div key={idx} className="media-card">
            {m.includes(".mp4") ? (
              <video className="media-content" controls src={m} />
            ) : (
              <img
                className="media-content"
                src={m}
                alt={`Downloaded media ${idx + 1}`}
              />
            )}
            <a
              className="download-link"
              href={`http://localhost:5187/api/download/file?url=${encodeURIComponent(
                m
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;