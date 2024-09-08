import React, { useState, useEffect } from 'react';
import { updateBedAvailability, getBedAvailability } from '../services/api';
import NavbarAdm from './Admin/Navbar';
import Inventory from './Inventory';

const Dashboard = ({ setHospitalName, uniqueId, hospitalName }) => {
  const [hospitals, setHospitals] = useState([]);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [currentHospital, setCurrentHospital] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (uniqueId) {
      fetchHospitalNameByUniqueId(uniqueId);
      fetchHospitals();
    }
  }, [uniqueId]);

  const fetchHospitalNameByUniqueId = async (uniqueId) => {
    try {
      const response = await fetch('http://localhost:5000/api/hospital/bed-availability');
      const hospitals = await response.json();
      
      const hospital = hospitals.find(hospital => hospital.uniqueId === uniqueId);
      if (hospital) {
        setHospitalName(hospital.name);
        setCurrentHospital(hospital);
      } else {
        setError('Hospital not found');
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setError('Error fetching hospital data');
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hospital/bed-availability');
      const hospitals = await response.json();
      setHospitals(hospitals);
      if (uniqueId) {
        const hospital = hospitals.find(h => h.uniqueId === uniqueId);
        setCurrentHospital(hospital);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateBedAvailability(availableBeds);
      fetchHospitals();
    } catch (error) {
      console.error('Failed to update bed availability:', error);
    }
  };

  const getBedAvailabilityColor = (availableBeds) => {
    if (availableBeds < 5) return 'bg-red-500 text-white';
    if (availableBeds >= 5 && availableBeds <= 20) return 'bg-yellow-300 text-black';
    return 'bg-green-300 text-black';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdm />
      <div className="container mx-auto px-4 py-8" style={{color:'black'}}>
        <h2 className="text-3xl font-bold text-center mb-8" style={{color:'black'}}>Dashboard</h2>
        
        <div className="mb-8 text-center">
          <input
            type="number"
            value={availableBeds}
            onChange={(e) => setAvailableBeds(e.target.value)}
            placeholder="Available Beds"
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Beds
          </button>
        </div>

        {currentHospital && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Hospital: {currentHospital.name}</h3>
            <p className="text-lg">
              Available Beds: <span className="font-bold">{currentHospital.availableBeds}</span> / 
              Total Beds: <span className="font-bold">{currentHospital.totalBeds}</span>
            </p>
          </div>
        )}

        <Inventory uniqueId={uniqueId} hospitalName={hospitalName} />
        
        <AdminPanel />

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">All Hospitals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Beds</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Beds</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hospitals.map((hospital) => (
                  <tr key={hospital._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${getBedAvailabilityColor(hospital.availableBeds)}`}>
                      {hospital.availableBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.totalBeds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/opd/requests');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/opd/approve/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        setRequests((prevRequests) => prevRequests.filter(request => request._id !== id));
        alert('Request approved');
      } else {
        throw new Error('Error approving request');
      }
    } catch (error) {
      console.error('Approval Error:', error);
      alert('Failed to approve the request');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Pending OPD Requests</h2>
      {requests.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="text-sm sm:text-base">
                <strong>{request.patientName}</strong> requested a bed at <strong>{request.hospital}</strong>
              </div>
              <button
                onClick={() => approveRequest(request._id)}
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pending requests.</p>
      )}
    </div>
  );
};

export default Dashboard;