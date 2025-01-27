import React, { useState, useEffect } from 'react';
import { ShortenUrlForm } from '../components/Dashboard/ShortenUrlForm.tsx';
import { UrlTable } from '../components/Dashboard/UrlTable.tsx';
import api from '../services/api.ts';

interface Url {
  _id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
}

const Dashboard = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the list of URLs from the server.
   * Updates the `urls` state and handles loading/error states.
   */
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await api.get('/urls');
      setUrls(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      setError('Failed to fetch URLs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new URL to the list.
   * Prepends the new URL to the existing list in the `urls` state.
   *
   * @param newUrl - The new URL object to be added.
   */
  const addUrlToTable = (newUrl: Url) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  /**
   * Effect to fetch URLs when the component mounts.
   */
  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        URL Shortener Dashboard
      </h1>
      <ShortenUrlForm addUrlToTable={addUrlToTable} />
      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <UrlTable propsurls={urls} />
      )}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Dashboard;
