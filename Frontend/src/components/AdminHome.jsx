import React, {useState} from 'react';
import Navbar from './Navbar';

export default function AdminHome() {
      
  return (
    <div className="min-h-screen bg-[#facb76]">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-700 mb-2">
          Welcome to the admin dashboard!
        </p>
        <p className="text-center text-gray-700 mb-8">
          You can manage user profiles, check bill history, and generate bills here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              View User
            </h2>
            <form>
              <label htmlFor="meterView" className="block text-sm font-medium text-gray-700 mb-2">
                Meter Number
              </label>
              <input
                type="text"
                name="meterView"
                id="meterView"
                placeholder="Enter meter number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
              >
                View User
              </button>
            </form>
          </div>

          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Bill History
            </h2>
            <form>
              <label htmlFor="meterHistory" className="block text-sm font-medium text-gray-700 mb-2">
                Meter Number
              </label>
              <input
                type="text"
                name="meterHistory"
                id="meterHistory"
                placeholder="Enter meter number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
              >
                Check History
              </button>
            </form>
          </div>

          {/* Card 3: Generate Bill */}
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Generate Bill
            </h2>
            <form>
              <label htmlFor="meterGenerate" className="block text-sm font-medium text-gray-700 mb-2">
                Meter Number
              </label>
              <input
                type="text"
                name="meterGenerate"
                id="meterGenerate"
                placeholder="Enter meter number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
              />

              <label htmlFor="electricityUsed" className="block text-sm font-medium text-gray-700 mb-2">
                Electricity Used (kWh)
              </label>
              <input
                type="number"
                name="electricityUsed"
                id="electricityUsed"
                placeholder="Enter amount"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
              />

              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
              >
                Generate Bill
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
