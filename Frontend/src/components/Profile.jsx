import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
import axios from 'axios';
import { User, Calendar, Bell, FileText, Clock, Download } from 'lucide-react';
import { authStore } from '../store/auth.store';

const host = import.meta.env.VITE_BACKEND_HOST;

export default function Profile() {
  const navigate = useNavigate();
  const { authUser } = authStore();
  const [editMode, setEditMode] = useState(false);
  
  // User Details State
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

  // Bills and Payment State
  const [dueBills, setDueBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch User Details
  const fetchUserDetails = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/user/get/${user_id}`);
      setUserDetails(response.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch Due Bills
  const fetchDueBills = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/bill/due-bills/${user_id}`);
      setDueBills(response.data);
    } catch (error) {
      console.error("Error fetching due bills:", error);
    }
  };

  // Fetch Payment History
  const fetchPaidBills = async () => {
    try {
      const response = await axios.get(`${host}/api/bill/receipt/${authUser.user_id}`);
      setPaidBills(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  // Fetch Billing History
  const fetchBillingHistory = async () => {
    try {
      const response = await axios.get(`${host}/api/bill/history/${authUser.user_id}`);
      setBillingHistory(response.data);
    } catch (error) {
      console.error("Error fetching billing history:", error);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${host}/api/notifi/all-notifi?userId=${authUser.user_id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to mock data if API fails
      setNotifications([
        {
          id: 1,
          message: 'Your bill for March 2025 is now available.',
          date: 'April 1, 2025'
        },
        {
          id: 2,
          message: 'Scheduled maintenance on April 28, 2025. Expect brief outages between 2AM-4AM.',
          date: 'April 15, 2025'
        }
      ]);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchUserDetails();
    fetchDueBills();
    fetchPaidBills();
    fetchBillingHistory();
    fetchNotifications();
  }, []);

  // Update edit data when edit mode changes or user details update
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

  // Handle user update
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${host}/api/user/update/${authUser.user_id}`, editData);
      if (response.status === 200) {
        setUserDetails({ ...userDetails, ...editData });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update user details.");
    }
  };

  // Handle bill payment
  const handlePayBill = (billId) => {
    navigate('/bill', { state: { billId } });
  };

  // Handle notification dismissal
  const dismissNotification = async (id) => {
    try {
      // In a real app, you would call an API here
      // await axios.delete(`${host}/api/notifi/dismiss/${id}`);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  // Format utilities
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Card wrapper component
  const CardWrapper = ({ children, header }) => (
    <div className="bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
        {header}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Account Information Card */}
          <CardWrapper
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Account Information
                </h2>
                <button
                  className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                    editMode 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
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
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                <span className="text-xl font-bold text-blue-600">
                  {userDetails.fullName?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{userDetails.fullName}</h3>
              <p className="text-sm text-gray-500">Customer since November 2022</p>
            </div>
            {editMode ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editData.fullName}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-600 w-1/3">Email:</span>
                  <span className="text-sm text-gray-800">{userDetails.email}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-600 w-1/3">Phone:</span>
                  <span className="text-sm text-gray-800">{userDetails.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-600 w-1/3">Address:</span>
                  <span className="text-sm text-gray-800">{userDetails.address}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-600 w-1/3">Meter #:</span>
                  <span className="text-sm text-gray-800">{userDetails.meterNumber}</span>
                </div>
              </div>
            )}
          </CardWrapper>

          {/* Pending Bills Card */}
          <CardWrapper 
            header={
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Pending Bills
              </h2>
            }
          >
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
                      <h3 className="font-medium text-gray-800">{formattedMonth}</h3>
                      <span className="font-bold text-blue-600">{formatCurrency(bill.total_amount)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      <p className="text-red-600">Due Date: {formattedDueDate}</p>
                      <p>Units consumed: {bill.units_consumed}</p>
                    </div>
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => handlePayBill(bill.bill_id)}
                    >
                      Pay Now
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <CheckCircleIcon className="h-full w-full" />
                </div>
                <p className="text-gray-600">You have no pending bills!</p>
              </div>
            )}
            <div className="mt-4 text-sm text-gray-500">
              <p className="text-blue-600">Next bill generation date: April 30, 2025</p>
            </div>
          </CardWrapper>

          {/* Payment History Card */}
          <CardWrapper
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Payments
                </h2>
                <button 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800" 
                  onClick={() => navigate('/payment-history')}
                >
                  View All
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {paidBills.length > 0 ? (
                paidBills.slice(0, 2).map(bill => (
                  <div key={bill.receipt_number} className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-800">
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
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <FileText className="h-full w-full" />
                  </div>
                  <p className="text-gray-600">No payment history available!</p>
                </div>
              )}
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Last 3 months average:</span>
                <span className="font-medium text-gray-800">$72.19</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-700">Year to date total:</span>
                <span className="font-medium text-gray-800">$216.57</span>
              </div>
            </div>
          </CardWrapper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications Section */}
          <CardWrapper 
            header={
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notifications
              </h2>
            }
          >
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
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <Bell className="h-full w-full" />
                </div>
                <p className="text-gray-600">No notifications at the moment!</p>
              </div>
            )}
          </CardWrapper>

          {/* Billing History */}
          <CardWrapper
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Billing History
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Download Statement
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map((bill) => {
                    const formattedMonth = new Date(bill.billing_month).toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    });
                    return (
                      <tr key={bill.bill_id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formattedMonth}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{bill.units_consumed}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(bill.total_amount)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 flex items-center justify-end space-x-1"
                            onClick={() => navigate(`/bill/${bill.bill_id}`)}
                          >
                            <span>View</span>
                            <Download className="h-3 w-3 ml-1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>
        
        {/* Usage Overview Card (from second example) */}
        <div className="mt-6">
          <CardWrapper
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Usage Overview
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
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

// Mock component for the CheckCircleIcon
const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);