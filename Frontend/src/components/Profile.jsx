import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
import axios from 'axios';
const host = import.meta.env.VITE_BACKEND_HOST;
import { authStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { authUser } = authStore();
  const navigate = useNavigate();
  
  const [dueBills, setDueBills] = useState([]);
  const fetchDueBills = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/bill/due-bills/${user_id}`);
      setDueBills(response.data);
    } catch (error) {
      console.error("Error fetching due bills:", error);
    }
  };
  useEffect(() => {
    fetchDueBills();
  }, []);

  const handlePayBill = async (billId) => {
    try {
      navigate('/bill', { state: { billId } });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Please try again later.");
    }
  };
  

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    meterNumber: ""
  });
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [editMode, setEditMode] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/user/get/${user_id}`);
      setUserDetails(response.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  useEffect(() => {
    if (editMode) {
      setEditData({
        fullName: userDetails.fullName,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
      });
    }
  }, [editMode, userDetails]);

  const [paidBills, setPaidBills] = useState([]);
  const fetchPaidBills = async () => {
    try {
      const response = await axios.get(`${host}/api/bill/receipt/${authUser.user_id}`);
      setPaidBills(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };
  useEffect(() => {
    fetchPaidBills();
  }, []);

  const [notifications, setNotifications] = useState([]);
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // CardWrapper component remains unchanged
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

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
            {/* Account Information Card */}
            <CardWrapper
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Account Information</h2>
                  <button
                    className="text-sm font-medium hover:cursor-pointer hover:bg-gray-200 bg-amber-50 rounded-md pl-3 pr-3 pt-2 pb-2"
                    onClick={() => {
                      if (editMode) {
                        handleUpdate();
                      }
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
                    value={editData.fullName}
                    onChange={(e) =>
                      setEditData({ ...editData, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                  />
                  <input
                    className="w-full p-2 border rounded mb-2"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <input
                    className="w-full p-2 border rounded mb-2"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    placeholder="Phone"
                  />
                  <input
                    className="w-full p-2 border rounded mb-2"
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    placeholder="Address"
                  />
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
              {dueBills.length > 0 ? (
                dueBills.map((bill) => {
                  const formattedMonth = new Date(bill.billing_month).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  const formattedDueDate = new Date(bill.due_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  return (
                    <div key={bill.bill_id} className="border border-gray-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{formattedMonth}</h3>
                        <span className="font-bold text-blue-600">₹{parseFloat(bill.total_amount).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <p className="text-red-600">Due Date: {formattedDueDate}</p>
                        <p>Units consumed: {bill.units_consumed}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex-grow"
                          onClick={() => handlePayBill(bill.bill_id)}
                        >
                          Pay Now
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors bg-green-500">
                          View Bill
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-black">You have no pending bills!</p>
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
                  <button className="text-sm font-medium" onClick={()=>{navigate('/payment-history')}}>View All</button>
                </div>
              }
            >
              <div className="space-y-4">
                {paidBills.length > 0 ? (
                  paidBills.map(bill => (
                    <div key={bill.receipt_number} className="border border-gray-200 rounded-md p-4 bg-white">
                      
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {formatDate(bill.payment_date)}
                        </h3>
                        <span className="font-bold text-green-600">
                          {formatCurrency(bill.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Account: {bill.account_number}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() =>
                          navigate('/receipt', {
                            state: {
                              receiptId: bill.receipt_number,
                              paymentDetails: {
                                bill_id: bill.bill_id, 
                                amount: bill.amount,
                                accountNumber: bill.account_number,
                                paymentMethod: bill.payment_method, 
                              }
                            }
                          })
                        }>
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-black">No payment history available!</p>
                  </div>
                )}
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
            <div className='grid grid-cols-1 grid-rows-2 w-full '>
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
    </div>
  );
}
