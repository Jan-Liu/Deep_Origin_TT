import React, { useEffect, useState } from "react";
import api from "../../services/api.ts";

interface Url {
  _id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
}
interface UrlTableProps {
  propsurls: Url[]; // List of URLs to display
}
export const UrlTable: React.FC<UrlTableProps> = ({ propsurls }) => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlugId, setEditingSlugId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
  useEffect(() => {
      return () => {
        fetchUrls();
    }
  }, [propsurls])
  
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await api.get("/urls");
      setUrls(response.data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError("Failed to fetch URLs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  const handleVisit = async (shortUrl: string, slug: string) => {
    try {
      // Open the short URL in a new tab
      window.open(shortUrl, "_blank");

      // Optionally fetch the updated URL data
      const response = await api.get(`/urls/${slug}`);
        const updatedUrl = response.data;
        setUrls(updatedUrl);
    } catch (err) {
      if (err.response?.status === 404) {
        console.error("Slug not found:", slug);
        setError("The requested URL does not exist.");
      } else {
        console.error("Failed to update visit count:", err);
        setError("Failed to update visit count. Please try again.");
      }
    }
  };



  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setSuccessMessage("Short URL copied to clipboard!");
    setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
  };

  const handleEditSlug = (id: string) => {
    const url = urls.find((url) => url._id === id);
    if (url) {
      setEditingSlugId(id);
      setNewSlug(url.slug);
    } else {
      setError("URL not found for editing.");
    }
  };

  const handleSaveSlug = async () => {
    if (!newSlug.trim()) {
      setError("Slug cannot be empty.");
      return;
    }

    try {
      const response = await api.patch(`/urls/${editingSlugId}/slug`, { newSlug });
      const updatedUrl: Url = response.data;

      setUrls((prevUrls) =>
        prevUrls.map((url) => (url._id === updatedUrl._id ? updatedUrl : url))
      );
      setEditingSlugId(null);
      setNewSlug("");
      setSuccessMessage("Slug updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
        fetchUrls();
    } catch (err) {
      setError("Failed to update slug. Ensure it is unique.");
    }
  };

  const handleCancelEdit = () => {
    setEditingSlugId(null);
    setNewSlug("");
    setError(null); // Clear any errors from editing
    
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-2xl font-bold mb-4">Your Shortened URLs</h2>
      {successMessage && <p className="text-center text-green-500 mb-4">{successMessage}</p>}
      {urls.length === 0 ? (
        <p className="text-center">No URLs found. Create one to get started!</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-center">Slug</th>
              <th className="border px-4 py-2 text-center">Original URL</th>
              <th className="border px-4 py-2 text-center">Short URL</th>
              <th className="border px-4 py-2 text-center">Visits</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td className="border px-4 py-2 text-center align-middle">
                  {editingSlugId === url._id ? (
                    <input
                      type="text"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    url.slug
                  )}
                </td>
                <td className="border px-4 py-2 text-center align-middle truncate max-w-xs">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {url.originalUrl}
                  </a>
                </td>
                <td className="border px-4 py-2 text-center align-middle">
  <button
    onClick={() => handleVisit(url.originalUrl, url.slug)} // Pass both shortUrl and slug
    className="text-blue-500 underline"
  >
    {url.shortUrl}
  </button>
</td>
                <td className="border px-4 py-2 text-center align-middle">{url.visitCount}</td>
                <td className="border px-4 py-2 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    {editingSlugId === url._id ? (
                      <>
                        <button
                          onClick={handleSaveSlug}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditSlug(url._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
