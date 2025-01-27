import React, { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

// Interface for the form data structure
interface FormData {
  username: string;
  password: string;
}

// Interface for Axios error response structure (adjust according to your API's error format)
interface ErrorResponse {
  response: {
    data: {
      error: string;
    };
  };
}

const Signup: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Handles form submission for user registration
   * @param e - React form event
   * @returns Promise<void>
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      // Type guard to check if error matches expected structure
      if (isErrorResponse(err)) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  /**
   * Type guard for custom error response
   * @param error - The caught error
   * @returns boolean indicating if it's an ErrorResponse
   */
  const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (error as ErrorResponse).response?.data?.error !== undefined;
  };

  /**
   * Handles input changes and updates form state
   * @param e - React change event from input element
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full mt-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
