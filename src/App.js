import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const fetchMedia = async () => {
  //   setError("");
  //   setMedia([]);
  //   if (!url) { setError("Please enter an Instagram post URL"); return; }

  //   setLoading(true);
  //   try {
  //     const res = await fetch("https://localhost:5187/api/download", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ url })
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       setError(data || data.message || "Server error");
  //     } else {
  //       setMedia(data.media || []);
  //     }
  //   } catch (e) {
  //     setError("Failed to contact backend. Is it running?");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchMedia = async () => {
    setError("");
    setMedia([]);
    if (!url) { setError("Please enter an Instagram post URL"); return; }

    setLoading(true);
    try {
      // --- FIX 1: Correct URL ---
      const res = await fetch("http://localhost:5187/api/download", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      // --- FIX 2: Check 'ok' before parsing JSON ---
      if (!res.ok) {
        // Get the error message as plain text from the backend
        const errorText = await res.text(); 
        setError(errorText || "Server error");
      } else {
        // If we are here, res.ok is true, and we expect JSON
        const data = await res.json();
        setMedia(data.media || []);
      }

    } catch (e) {
      // This will now correctly catch network failures or CORS issues
      setError("Failed to contact backend. Is it running? (Check URL/CORS)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Instagram Media Downloader</h2>
      <div>
        <input
          style={{ width: "100%", padding: "12px", fontSize: 16 }}
          placeholder="Paste Instagram post URL (https://www.instagram.com/p/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={fetchMedia} style={{ padding: "10px 16px" }} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Media"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 20 }}>
        {media.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 16, border: "1px solid #ddd", padding: 12 }}>
            {m.includes(".mp4") ? (
              <video width="100%" controls src={m} />
            ) : (
              <img src={m} alt={`media-${idx}`} style={{ maxWidth: "100%" }} />
            )}
            <div style={{ marginTop: 8 }}>
              <a 
  href={`http://localhost:5187/api/download/file?url=${encodeURIComponent(m)}`} 
  target="_blank" 
  rel="noreferrer"
>
  Download
</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
