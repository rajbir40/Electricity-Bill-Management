import React, { useState } from 'react';
import Navbar from './Navbar';

export default function GenerateBill() {
  const [meterId, setMeterId] = useState('');
  const [unitsConsumed, setUnitsConsumed] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const RATE_PER_UNIT = 0.15; // example rate per kWh

  // Helper to format a Date object as YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Calculate the billing month (current date) and due date (15 days from today)
    const currentDate = new Date();
    const billingMonth = formatDate(currentDate);
    const dueDateObj = new Date(currentDate);
    dueDateObj.setDate(dueDateObj.getDate() + 15);
    const dueDate = formatDate(dueDateObj);

    // Calculate total amount based on usage and the defined rate
    const totalAmount = parseFloat(unitsConsumed) * RATE_PER_UNIT;

    // Prepare the payload based on your SQL schema
    const payload = {
      meter_id: meterId,
      units_consumed: parseFloat(unitsConsumed),
      total_amount: totalAmount.toFixed(2),
      billing_month: billingMonth,
      due_date: dueDate,
      // status will default to 'unpaid' and generated_at is handled by the DB
    };

    try {
      const response = await fetch('http://localhost:8080/api/meter/generate-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Bill generated successfully!');
      } else {
        setError(data.error || 'Failed to generate bill');
      }
    } catch (err) {
      setError('Error generating bill');
    }
  };

  return (
    <div className="min-h-screen bg-[#facb76]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Generate Bill
        </h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
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
            required
          />

          <label htmlFor="unitsConsumed" className="block text-sm font-medium text-gray-700 mb-2">
            Electricity Used (kWh)
          </label>
          <input
            type="number"
            id="unitsConsumed"
            value={unitsConsumed}
            onChange={(e) => setUnitsConsumed(e.target.value)}
            placeholder="Enter usage amount"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
            required
            step="0.01"
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Generate Bill
          </button>
        </form>

        {message && <p className="text-center text-green-600 mt-4">{message}</p>}
        {error && <p className="text-center text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}
