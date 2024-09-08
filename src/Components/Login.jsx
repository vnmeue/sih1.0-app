import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css'; // Ensure correct CSS import

const Login = ({ setIsLoggedIn, setHospitalName, setUniqueId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueIdState] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setHospitalName(localStorage.getItem('hospitalName'));
      setUniqueId(localStorage.getItem('uniqueId'));
    }
  }, [setIsLoggedIn, setHospitalName, setUniqueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password, uniqueId);
      localStorage.setItem('token', response.token);
      localStorage.setItem('hospitalId', response.hospitalId);
      localStorage.setItem('hospitalName', response.hospitalName);
      localStorage.setItem('uniqueId', uniqueId);
      setUniqueId(uniqueId);
      setHospitalName(response.hospitalName);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center items-center">
            <img src='Untitled design.svg' alt="Centered Logo" className="h-[150px]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Manushi Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Log in to your workspace
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="unique-id" className="sr-only">Hospital Unique ID</label>
              <input
                id="unique-id"
                name="unique-id"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Hospital Unique ID"
                value={uniqueId}
                onChange={(e) => setUniqueIdState(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

      

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
