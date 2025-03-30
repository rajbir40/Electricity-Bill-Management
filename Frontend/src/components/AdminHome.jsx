import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import view from '../assets/view.jpg';
import meter from '../assets/meter.jpg';
import bill from '../assets/bill.jpg';
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
          {/* Card 1: View User */}
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <img src={view} alt="" />
            <Link to="/admin/find-user" className="block text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                View User
              </h2>
              <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                View User Profile
              </button>
            </Link>
          </div>

          {/* Card 2: Bill History */}
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <img src={meter} alt="" />
            <Link to="/admin/find-meter" className="block text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bill History
              </h2>
              <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                View bill history
              </button>
            </Link>
          </div>

          {/* Card 3: Generate Bill */}
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <img src={bill} alt="" />
            <Link to="/admin/generate-bill" className="block text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Generate Bill
              </h2>
              <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                 Generate Bill
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
