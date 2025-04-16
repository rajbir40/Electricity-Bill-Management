import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import home from '../assets/home.jpg';
import axios from 'axios';
import { authStore } from '../store/auth.store';

const host = import.meta.env.VITE_BACKEND_HOST;

export default function Home() {
  const { authUser } = authStore();
  const navigate = useNavigate();
  const [dueBills, setDueBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    fetchDueBills();
  }, []);

  const fetchDueBills = async () => {
    setIsLoading(true);
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/bill/due-bills/${user_id}`);
      setDueBills(response.data);
    } catch (error) {
      console.error("Error fetching due bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayBill = async (billId) => {
    try {
      navigate('/bill', { state: { billId } });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Please try again later.");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side: Image with caption */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={home} 
                alt="Home" 
                className="w-full h-auto object-cover" 
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {authUser.full_name || 'User'}</h2>
                <p className="text-gray-600">
                  Monitor your electricity usage, manage bills, and make payments all in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Right side: Due Bills Section */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Due Bills</h2>
                  <Link 
                    to="/bills" 
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View All
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading bills...
                </div>
              ) : dueBills.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Due Bills</h3>
                  <p className="text-gray-500">You're all caught up with your payments.</p>
                </div>
              ) : (
                <div>
                  {dueBills.slice(0, 3).map((bill) => {
                    const daysRemaining = Math.ceil(
                      (new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    
                    const isOverdue = daysRemaining < 0;
                    
                    return (
                      <div key={bill.bill_id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {new Date(bill.billing_month).toLocaleString('default', {
                                month: 'long',
                                year: 'numeric',
                              })}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-gray-800">{formatCurrency(bill.total_amount)}</div>
                            {bill.status === 'unpaid' && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isOverdue 
                                  ? 'bg-red-100 text-red-800' 
                                  : daysRemaining <= 3 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isOverdue 
                                  ? `Overdue by ${Math.abs(daysRemaining)} days` 
                                  : `${daysRemaining} days remaining`}
                              </span>
                            )}
                            {bill.status === 'paid' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                            bill.status === 'unpaid' 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => handlePayBill(bill.bill_id)}
                          disabled={bill.status === 'paid'}
                        >
                          {bill.status === 'paid' ? "Paid" : "Pay Now"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}