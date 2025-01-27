import React, { useState } from "react";
import api from "../../services/api.ts";
import validator from "validator";

interface ShortenUrlFormProps {
  addUrlToTable: (newUrl: any) => void; // Callback to add a new URL to the table
}

export const ShortenUrlForm: React.FC<ShortenUrlFormProps> = ({ addUrlToTable }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate the URL
    if (!validator.isURL(originalUrl)) {
      setError("Invalid URL format. Please enter a valid URL.");
      return;
    } else {
        setSuccessMessage("Added successfully!");
    setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
    }

    setError(""); // Clear previous errors

    try {
      const response = await api.post("/urls", { originalUrl, slug });
      const newUrl = response.data;
      addUrlToTable(newUrl); // Add the new URL to the table
      setOriginalUrl(""); // Clear the input fields
      setSlug("");
    } catch (err: any) {
      console.error("Failed to shorten URL", err);
      setError(err.response?.data?.error || "Failed to shorten URL. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
          <h2 className="text-2xl font-bold mb-4">Shorten URL</h2>
          {successMessage && <p className="text-center text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Enter URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Optional custom slug (e.g., my-url)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Shorten
      </button>
    </form>
  );
};
