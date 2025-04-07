import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
export default function FindUser() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUser(null);
    setBillingHistory([]);
    try {
      const response = await fetch(`http://localhost:8080/api/user/get/${userId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.length === 0) {
        setError('User not found');
      } else {
        setUser(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch user data');
    }
  };

  const handleBillingHistory = async () => {
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/user/billing-history?userid=${userId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.length === 0) {
        setError('No billing history found');
      } else {
        setBillingHistory(data);
      }
    } catch (err) {
      setError('Failed to fetch billing history');
    }
  };

  return (
    <div className="min-h-screen bg-[#facb76]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Find User
        </h1>
        <form onSubmit={handleUserSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Find User
          </button>
        </form>

        {error && (
          <p className="text-center text-red-600 mt-4">{error}</p>
        )}

        {user && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              User Information
            </h2>
            <p><strong>ID:</strong> {user.user_id}</p>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <button
              onClick={()=>{navigate('/billing-history')}}
              className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              See Billing History
            </button>
          </div>
        )}

        {billingHistory.length > 0 && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Billing History
            </h2>
            <ul>
              {billingHistory.map((bill) => (
                <li key={bill.bill_id} className="border-b border-gray-300 py-2">
                  <p><strong>Bill ID:</strong> {bill.bill_id}</p>
                  <p><strong>Billing Month:</strong> {bill.billing_month}</p>
                  <p><strong>Units Consumed:</strong> {bill.units_consumed}</p>
                  <p><strong>Total Amount:</strong> {bill.total_amount}</p>
                  <p><strong>Status:</strong> {bill.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
