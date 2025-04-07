import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import profile from '../assets/profile.jpg';
import axios from 'axios';
const host = import.meta.env.VITE_BACKEND_HOST;
import { authStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

export default function PaymentHistory() {
      const { authUser } = authStore();
        const navigate = useNavigate();
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
              <h1 className="text-3xl font-bold text-[#d0d0ab] mb-6 text-center">Payment History</h1>
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
              </div>
            </div>
      </div>
  )
}
