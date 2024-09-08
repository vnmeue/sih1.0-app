import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set authentication token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Updated login function in api.js
export const login = async (username, password, uniqueId) => {
  try {
    // Send POST request with username, password, and uniqueId
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
      uniqueId,
    });

    // If login is successful, store the token and return the response data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);  // Save token to localStorage
      setAuthToken(response.data.token);  // Set the auth token for future requests
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message);
    throw error;
  }
};


// Update bed availability
export const updateBedAvailability = async (availableBeds) => {
  const response = await axios.put(`${API_URL}/hospital/update-beds`, { availableBeds });
  return response.data;
};

// Get bed availability
export const getBedAvailability = async () => {
  const response = await axios.get(`${API_URL}/hospital/bed-availability`);
  return response.data;
};

// Add new maintainer
export const addMaintainer = async (hospitalId, username, password) => {
  const response = await axios.post(`${API_URL}/hospital/add-maintainer`, { hospitalId, username, password });
  return response.data;
};


export const getHospitalByUniqueId = async (uniqueId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/hospital/unique/${uniqueId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItem = async (itemId) => {
  const response = await axios.delete(`http://localhost:5000/api/inventory/items/${itemId}`);
  return response.data;
};

export const getInventory = async (hospitalId) => {
  const response = await axios.get(`http://localhost:5000/api/inventory/items/${hospitalId}`);
  return response.data;
};

export const updateInventory = async (hospitalId, newItem) => {
  await axios.post(`http://localhost:5000/api/inventory/items/${hospitalId}`, newItem);
};
