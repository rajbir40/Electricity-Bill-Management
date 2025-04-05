import React, { useState } from 'react';
import Navbar from './Navbar';

export default function Bill() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    amount: '',
    email: '',
    paymentMethod: 'creditCard'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsPaid(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Electricity Bill Payment</h1>
          
          {!isPaid ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Payment Details</h2>
                <p className="text-blue-600">Pay your electricity bill securely and instantly.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Bill Amount (USD)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Receipt)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="creditCard" className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900">Credit Card</div>
                    </label>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      id="debitCard"
                      name="paymentMethod"
                      value="debitCard"
                      checked={formData.paymentMethod === 'debitCard'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="debitCard" className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900">Debit Card</div>
                    </label>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      id="bankTransfer"
                      name="paymentMethod"
                      value="bankTransfer"
                      checked={formData.paymentMethod === 'bankTransfer'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="bankTransfer" className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900">Bank Transfer</div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-500">
                    A confirmation receipt will be sent to your email after payment
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    Total: ${formData.amount || '0.00'}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your electricity bill has been paid successfully.</p>
              <p className="text-gray-600 mb-2">Amount: <span className="font-semibold">${formData.amount}</span></p>
              <p className="text-gray-600 mb-6">Receipt sent to: <span className="font-semibold">{formData.email}</span></p>
              <button
                onClick={() => {setIsPaid(false); setFormData({...formData, amount: ''})}}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Make Another Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}