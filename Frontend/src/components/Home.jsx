import React from 'react';
import Navbar from './Navbar';
import home from '../assets/home.jpg';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
        {/* Left side: Image */}
        <div className="w-full md:w-1/2 p-4">
          <img
            src={home}
            alt="Home"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        {/* Right side: Cards */}
        <div className="w-full md:w-1/2 p-4 space-y-4">
          {/* Due Bills Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Due Bills</h2>
            <div className="border border-gray-200 rounded-md mb-4">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">March 2025</p>
                    <p className="text-sm text-gray-500">Due on: April 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">$127.85</p>
                    <p className="text-xs text-red-500">3 days remaining</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">February 2025</p>
                    <p className="text-sm text-gray-500">Due on: March 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">$119.40</p>
                    <p className="text-xs text-green-500">Paid</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Bills →
              </button>
            </div>
          </div>

          {/* Pay Bill Form */}
          <form className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Pay Your Bill</h2>
            <div className="mb-4">
              <label
                htmlFor="meterNumber"
                className="block text-gray-700 mb-2"
              >
                Meter Number
              </label>
              <input
                type="text"
                id="meterNumber"
                placeholder="Enter meter number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="accountNumber"
                className="block text-gray-700 mb-2"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                placeholder="Enter account number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Pay Bill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}