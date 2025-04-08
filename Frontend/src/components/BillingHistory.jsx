import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
import axios from 'axios';
const host = import.meta.env.VITE_BACKEND_HOST;
import { authStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

export default function BillingHistory() {
  const { authUser } = authStore();
  const [billingHistory, setBillingHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleBillingHistory = async () => {
    setError('');
    try {
      const response = await fetch(`${host}/api/user/billing-history?userid=${authUser?.user_id}`);
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

  useEffect(() => {
    if (authUser?.user_id) {
      handleBillingHistory();
    }
  }, [authUser]);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'unpaid':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownloadReceipt = (billId) => {
    // Implement receipt download functionality
    console.log(`Downloading receipt for bill ${billId}`);
    // In a real implementation, this would likely redirect to a PDF or trigger a download
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
          <h1 className="text-3xl font-bold text-[#d0d0ab] mb-6 text-center">Billing History</h1>
          {error && (
            <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="text-center">{error}</p>
            </div>
          )}
          
          <div className="max-w-xl mx-auto">
            {billingHistory.length > 0 && (
              <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md px-4 py-3">
                <p className="text-slate-700">Showing {billingHistory.length} billing records</p>
              </div>
            )}
            
            <div className="space-y-6">
              {billingHistory.map((bill) => (
                <div key={bill.bill_id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="font-medium">Bill #{bill.bill_id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Billing Date</p>
                        <p className="font-medium">{bill.billing_month.split('T')[0]}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Units Consumed</p>
                        <p className="font-medium">{bill.units_consumed} kWh</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Amount</span>
                        <span className="text-lg font-bold text-slate-800">${bill.total_amount}</span>
                      </div>
                    </div>
                    
                    {bill.status.toLowerCase() === 'paid' && (
                      <div className="mt-4 pt-2">
                        <button 
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
                          }
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Download Receipt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {billingHistory.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Contact customer support for any billing inquiries</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}