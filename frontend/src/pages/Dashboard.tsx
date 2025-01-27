
import React, { useState, useEffect } from "react";
import { ShortenUrlForm } from "../components/Dashboard/ShortenUrlForm.tsx";
import { UrlTable } from "../components/Dashboard/UrlTable.tsx";
import api from "../services/api.ts";

interface Url {
  _id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
}

const Dashboard = () => {
  const [urls, setUrls] = useState<Url[]>([]); // State to hold URL data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error handling

  // Fetch all URLs from the backend
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await api.get("/urls");
      setUrls(response.data);
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error("Failed to fetch URLs:", err);
      setError("Failed to fetch URLs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new URL to the table
  const addUrlToTable = (newUrl: Url) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]); // Add the new URL to the top of the table
  };

  // Fetch URLs when the component mounts
  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">URL Shortener Dashboard</h1>

      {/* Form to create a new shortened URL */}
      <ShortenUrlForm addUrlToTable={addUrlToTable} />

      {/* Display URL table */}
      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <UrlTable propsurls={urls} />
      )}

      {/* Error message */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Dashboard;
