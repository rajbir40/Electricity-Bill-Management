import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authStore } from '../store/auth.store';

const host = import.meta.env.VITE_BACKEND_HOST;

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { receiptId, paymentDetails } = location.state || {};
  const { authUser } = authStore();

  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Received bill_id:", paymentDetails?.bill_id);
  useEffect(() => {
    const generateReceipt = async () => {
      try {
        const { fullName, email, user_id } = authUser;
        const { accountNumber, paymentMethod, amount, bill_id } = paymentDetails;
        const response = await axios.post(`${host}/api/bill/receipt`, {
          receipt_number: `REC-${Date.now().toString().slice(-6)}`,
          account_number: accountNumber, 
          user_id: user_id,
          customer_name: fullName,
          email,
          payment_method: paymentMethod,
          amount: amount,
          bill_id: bill_id
        });

        setReceipt(response.data);
      } catch (err) {
        console.error("Error generating receipt:", err);
        setError("Failed to generate receipt. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser && paymentDetails) {
      generateReceipt();
    } else {
      setError("Missing user or payment details.");
      setIsLoading(false);
    }
  }, [authUser, paymentDetails]);

  const handlePrint = () => {
    window.print();
  };


  const handleReturnToDashboard = () => {
    navigate('/home');
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-screen">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-xl mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-bold">Error</h2>
            </div>
            <p className="mb-6">{error}</p>
            <button
              onClick={handleReturnToDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 print:p-0">
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Payment Receipt</h1>
            <div className="flex space-x-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                Print
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm">From</p>
              <h3 className="font-medium text-gray-800">Electricity Service Provider</h3>
              <p className="text-gray-600">123 Energy Avenue</p>
              <p className="text-gray-600">Power City, PC 12345</p>
              <p className="text-gray-600">support@electricitysp.com</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">To</p>
              <h3 className="font-medium text-gray-800">{receipt?.customer_name || authUser?.fullName}</h3>
              <p className="text-gray-600">Account #{receipt?.account_number}</p>
              <p className="text-gray-600">{receipt?.email || authUser?.email}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h2 className="text-lg font-medium text-blue-800 mb-2">Receipt Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Receipt Number</p>
                <p className="font-medium">{receipt?.receipt_number || `REC-${Date.now().toString().slice(-6)}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">{formatDate(receipt?.paymentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{receipt?.payment_method || 'Credit Card'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-green-600">Paid</p>
              </div>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Period</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-800">Electricity Bill Payment</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {receipt?.billingPeriod || 'March 2025'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-800">
                    {formatCurrency(receipt?.amount || receipt?.total_amount || 0)}
                  </td>
                </tr>
                {/* {receipt?.charges?.map((charge, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-500">{charge.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500"></td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {formatCurrency(charge.amount)}
                    </td>
                  </tr>
                ))} */}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total</td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(receipt?.amount || receipt?.total_amount || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-2">
                    <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-600 font-medium">Payment Successful</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Thank you for your payment. This receipt serves as confirmation of your payment.
                </p>
              </div>
              <div className="hidden md:block">
                <svg className="h-12 w-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-8 print:hidden">
            <button
              onClick={handleReturnToDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs mt-6 print:hidden">
          For any questions regarding this receipt, please contact our customer support.
        </div>
      </div>
    </div>
  );
}
