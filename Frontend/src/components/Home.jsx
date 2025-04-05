import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import home from '../assets/home.jpg';
import axios from 'axios';

export default function Home() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

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
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <div key={bill.bill_id} className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{new Date(bill.billing_month).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                      <p className="text-sm text-gray-500">Due on: {new Date(bill.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${bill.total_amount.toFixed(2)}</p>
                      {new Date(bill.due_date) < new Date() ? (
                        <p className="text-xs text-red-500">Fine $50</p>
                      ) : (
                        <p className="text-xs text-red-500">{Math.ceil((new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days remaining</p>
                      )}
                      <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">Pay Now</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No unpaid bills available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
