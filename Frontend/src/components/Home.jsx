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

        {/* Right side: Form */}
        <div className="w-full md:w-1/2 p-4">
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
