import React, { useState } from 'react';
import api from '../../services/api.ts';

/**
 * SignupForm Component
 *
 * Renders a sign-up form that allows users to create an account.
 * Handles form submission and communicates with the backend API to register the user.
 */
export const SignupForm = () => {
  // State to hold form data and error messages
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  /**
   * Handles the form submission.
   * Sends the form data to the backend API to create a new user account.
   *
   * @param {React.FormEvent} e - The form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      window.location.href = '/login'; // Redirect to login page upon successful signup
    } catch (err) {
      setError('Failed to create account'); // Set error message if signup fails
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white"
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Sign Up
      </button>
    </form>
  );
};
