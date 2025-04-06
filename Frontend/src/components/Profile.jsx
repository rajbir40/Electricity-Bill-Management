import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
import axios from 'axios';
const host = import.meta.env.VITE_BACKEND_HOST;
import { authStore } from '../store/auth.store';

export default function Profile() {
  const { authUser } = authStore();

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    meterNumber: ""
  });
  const [editMode, setEditMode] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const user_id = authUser[0].user_id;
      const response = await axios.get(`${host}/api/user/get/${user_id}`);
      setUserDetails(response.data[0]);
      console.log("Fetched user data:", response.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${host}/api/user/update/${authUser[0].user_id}`, userDetails);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const paidBills = [
    { id: 1, month: "February 2025", amount: 119.40, paidDate: "March 10, 2025", billNumber: "INV-2502-87654" },
    { id: 2, month: "January 2025", amount: 132.75, paidDate: "February 12, 2025", billNumber: "INV-2501-87654" },
    { id: 3, month: "December 2024", amount: 145.20, paidDate: "January 8, 2025", billNumber: "INV-2412-87654" }
  ];

  const [pendingBills, setPendingBills] = useState([
    { id: 1, month: "March 2025", amount: 127.85, dueDate: "April 15, 2025", billNumber: "INV-2503-87654" }
  ]);

  const addPendingBill = (newBill) => {
    setPendingBills([...pendingBills, newBill]);
  };

  const [notifications, setNotifications] = useState([]);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // CardWrapper component with hover effect removed.
  const CardWrapper = ({ header, children }) => (
    <div className="relative rounded-lg shadow-xl overflow-hidden bg-white/50 backdrop-blur-md mt-4">
      {header && (
        <div className="px-6 py-4" style={{ backgroundColor: '#d0d0ab' }}>
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  console.log("Current userDetails state:", userDetails);

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${profile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-[#d0d0ab] mb-6 text-center">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardWrapper
  header={
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Account Information</h2>
      <button
        className="text-sm font-medium"
        onClick={() => {
          if (editMode) handleUpdate();
          setEditMode(!editMode);
        }}
      >
        {editMode ? "Save" : "Edit"}
      </button>
    </div>
  }
>
  <div className="flex justify-center mb-4">
    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-200">
      <span className="text-2xl font-bold text-blue-600">
        {userDetails.fullName?.split(' ').map(n => n[0]).join('')}
      </span>
    </div>
  </div>
  <div className="text-center mb-4">
    <h3 className="text-xl font-bold text-gray-800">{userDetails.fullName}</h3>
    <p className="text-gray-500">Customer since November 2022</p>
  </div>
  {editMode ? (
    <>
      <input
        className="w-full p-2 border rounded mb-2"
        value={userDetails.fullName}
        onChange={(e) =>
          setUserDetails({ ...userDetails, fullName: e.target.value })
        }
        placeholder="Full Name"
      />
      <input
        className="w-full p-2 border rounded mb-2"
        value={userDetails.email}
        onChange={(e) =>
          setUserDetails({ ...userDetails, email: e.target.value })
        }
        placeholder="Email"
      />
      <input
        className="w-full p-2 border rounded mb-2"
        value={userDetails.phone}
        onChange={(e) =>
          setUserDetails({ ...userDetails, phone: e.target.value })
        }
        placeholder="Phone"
      />
      <input
        className="w-full p-2 border rounded mb-2"
        value={userDetails.address}
        onChange={(e) =>
          setUserDetails({ ...userDetails, address: e.target.value })
        }
        placeholder="Address"
      />
      {/* Do not include meterNumber in edit mode */}
    </>
  ) : (
    <div className="space-y-3 border-t border-gray-100 pt-4">
      <div className="flex">
        <span className="font-medium text-gray-600 w-1/3">Email:</span>
        <span className="text-gray-800">{userDetails.email}</span>
      </div>
      <div className="flex">
        <span className="font-medium text-gray-600 w-1/3">Phone:</span>
        <span className="text-gray-800">{userDetails.phone}</span>
      </div>
      <div className="flex">
        <span className="font-medium text-gray-600 w-1/3">Address:</span>
        <span className="text-gray-800">{userDetails.address}</span>
      </div>
      <div className="flex">
        <span className="font-medium text-gray-600 w-1/3">Meter #:</span>
        <span className="text-gray-800">{userDetails.meterNumber}</span>
      </div>
    </div>
  )}
</CardWrapper>


            {/* Pending Bills Card */}
            <CardWrapper header={<h2 className="text-xl font-bold">Pending Bills</h2>}>
              {pendingBills.length > 0 ? (
                <div className="space-y-4">
                  {pendingBills.map(bill => (
                    <div key={bill.id} className="border border-gray-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{bill.month}</h3>
                        <span className="font-bold text-blue-600">${bill.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <p className='text-red-600'>Due Date: {bill.dueDate}</p>
                        <p>Bill #: {bill.billNumber}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex-grow">
                          Pay Now
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors bg-green-500">
                          View Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">You have no pending bills!</p>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <p className='text-blue-700'>Next bill generation date: April 30, 2025</p>
              </div>
            </CardWrapper>

            {/* Payment History Card */}
            <CardWrapper
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Payment History</h2>
                  <button className="text-sm font-medium">View All</button>
                </div>
              }
            >
              <div className="space-y-4">
                {paidBills.map(bill => (
                  <div key={bill.id} className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{bill.month}</h3>
                      <span className="font-bold text-green-600">${bill.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Paid on: {bill.paidDate}</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-900">Last 3 months average:</span>
                  <span className="font-semibold text-gray-800">$132.45</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-900">Year to date total:</span>
                  <span className="font-semibold text-gray-800">$397.95</span>
                </div>
              </div>
            </CardWrapper>
          </div>

          {/* Notifications Section */}
          <CardWrapper header={<h2 className="text-xl font-bold">Notifications</h2>}>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="border border-gray-200 rounded-md p-4 bg-white flex justify-between items-center">
                    <div>
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">Date: {notification.date}</p>
                    </div>
                    <button 
                      className="ml-4 text-red-600 hover:text-red-800 text-sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-black">No notifications at the moment!</p>
              </div>
            )}
          </CardWrapper>

          {/* Usage Overview Card */}
          <CardWrapper
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-center">Usage Overview</h2>
                <button className="text-sm font-medium">
                  View Detailed Analytics
                </button>
              </div>
            }
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-md p-4 text-center bg-white">
                <p className="text-gray-500 text-sm">Current Month</p>
                <p className="text-2xl font-bold text-gray-800">487 kWh</p>
                <p className="text-xs text-red-600">↑ 5% from last month</p>
              </div>
              <div className="border border-gray-200 rounded-md p-4 text-center bg-white">
                <p className="text-gray-500 text-sm">Monthly Average</p>
                <p className="text-2xl font-bold text-gray-800">462 kWh</p>
                <p className="text-xs text-green-600">↓ 2% from last year</p>
              </div>
              <div className="border border-gray-200 rounded-md p-4 text-center bg-white">
                <p className="text-gray-500 text-sm">Peak Usage</p>
                <p className="text-2xl font-bold text-gray-800">6 - 8 PM</p>
                <p className="text-xs text-gray-500">Weekdays</p>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
