import React, { useState } from 'react';
import Navbar from './Navbar';

export default function GenerateBill() {
  const [meterNumber, setMeterNumber] = useState('');
  const [unitsConsumed, setUnitsConsumed] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RATE_PER_UNIT = 0.15; 

  const calculateEstimate = () => {
    if (!unitsConsumed) return '0.00';
    const estimate = parseFloat(unitsConsumed) * RATE_PER_UNIT;
    return estimate.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      meterNumber: meterNumber,
      unitsConsumed: parseFloat(unitsConsumed),
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
        // Clear form on success
        setMeterNumber('');
        setUnitsConsumed('');
      } else {
        setError(data.error || 'Failed to generate bill');
      }
    } catch (err) {
      setError('Error generating bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#facb76] to-[#f8b84e]">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Generate Bill
          </h1>
          <p className="text-center text-gray-600 mb-8">Create a new electricity bill by entering meter details below</p>
          
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6">
              <label htmlFor="meterNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Meter Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="meterNumber"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="Enter meter number"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="unitsConsumed" className="block text-sm font-medium text-gray-700 mb-2">
                Units Consumed 
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <input
                  type="number"
                  id="unitsConsumed"
                  value={unitsConsumed}
                  onChange={(e) => setUnitsConsumed(e.target.value)}
                  placeholder="Enter units consumed"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {unitsConsumed && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Bill Amount:</p>
                <p className="text-xl font-bold text-blue-700">${calculateEstimate()}</p>
                <p className="text-xs text-gray-500 mt-1">Based on rate of ${RATE_PER_UNIT}/kWh</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg shadow text-white font-medium transition-all ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Generating...' : 'Generate Bill'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Bills are due within 30 days of generation</p>
          </div>
        </div>
      </div>
    </div>
  );
}