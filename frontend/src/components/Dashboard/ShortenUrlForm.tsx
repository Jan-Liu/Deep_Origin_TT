import React, { useState } from 'react';
import api from '../../services/api.ts';
import validator from 'validator';

/**
 * Props interface for the ShortenUrlForm component
 * @interface ShortenUrlFormProps
 * @property {Function} addUrlToTable - Callback to add new URL to parent component's list
 * @param {Object} newUrl - The newly created URL object from API response
 */
interface ShortenUrlFormProps {
  addUrlToTable: (newUrl: any) => void;
}

/**
 * Form component for creating shortened URLs with validation and API integration
 * @function ShortenUrlForm
 * @param {ShortenUrlFormProps} props - Component props
 * @returns {JSX.Element} Rendered form component with input fields and submission handling
 */
export const ShortenUrlForm: React.FC<ShortenUrlFormProps> = ({
  addUrlToTable,
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Handles form submission with validation and API communication
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} Promise representing the submission process
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL format using validator library
    if (!validator.isURL(originalUrl)) {
      setError('Invalid URL format. Please enter a valid URL.');
      return;
    } else {
      setSuccessMessage('Added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setError('');

    try {
      const response = await api.post('/urls', { originalUrl, slug });
      const newUrl = response.data;

      addUrlToTable(newUrl);
      setOriginalUrl('');
      setSlug('');
    } catch (err: any) {
      console.error('Failed to shorten URL', err);
      setError(
        err.response?.data?.error || 'Failed to shorten URL. Please try again.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">Shorten URL</h2>

      {/* Status message displays */}
      {successMessage && (
        <p className="text-center text-green-500 mb-4">{successMessage}</p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* URL input field */}
      <input
        type="text"
        placeholder="Enter URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {/* Custom slug input field */}
      <input
        type="text"
        placeholder="Optional custom slug (e.g., my-url)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Submission button */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Shorten
      </button>
    </form>
  );
};
