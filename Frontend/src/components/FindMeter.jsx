import React, { useState } from 'react';
import Navbar from './Navbar';

export default function FindMeter() {
  const [meterId, setMeterId] = useState('');
  const [meterInfo, setMeterInfo] = useState(null);
  const [error, setError] = useState('');

  const handleMeterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMeterInfo(null);
    try {
      const response = await fetch(`http://localhost:8080/api/meter/get-user?meterid=${meterId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.length === 0) {
        setError('Meter not found');
      } else {
        setMeterInfo(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch meter information');
    }
  };

  return (
    <div className="min-h-screen bg-[#facb76]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Find Meter
        </h1>
        <form onSubmit={handleMeterSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="meterId" className="block text-sm font-medium text-gray-700 mb-2">
            Meter ID
          </label>
          <input
            type="text"
            id="meterId"
            value={meterId}
            onChange={(e) => setMeterId(e.target.value)}
            placeholder="Enter meter ID"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Find Meter
          </button>
        </form>

        {error && (
          <p className="text-center text-red-600 mt-4">{error}</p>
        )}

        {meterInfo && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Meter Information
            </h2>
            <p><strong>User ID:</strong> {meterInfo.user_id}</p>
            <p><strong>Full Name:</strong> {meterInfo.fullName}</p>
            <p><strong>Email:</strong> {meterInfo.email}</p>
            <p><strong>Phone:</strong> {meterInfo.phone}</p>
            <p><strong>Meter Number:</strong> {meterInfo.meter_number}</p>
            <p><strong>Meter Type:</strong> {meterInfo.meter_type}</p>
          </div>
        )}
      </div>
    </div>
  );
}
