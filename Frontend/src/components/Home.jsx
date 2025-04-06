import React, { useState, useEffect } from 'react';
import { Navigate, Link} from 'react-router-dom';
import Navbar from './Navbar';
import home from '../assets/home.jpg';
import axios from 'axios';
import { authStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

const host = import.meta.env.VITE_BACKEND_HOST;

export default function Home() {
  const { authUser } = authStore();
  const navigate = useNavigate();
  

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  const [dueBills, setDueBills] = useState([]);

  useEffect(() => {
    fetchDueBills();
  }, []);

  const fetchDueBills = async () => {
    try {
      const user_id = authUser.user_id;
      const response = await axios.get(`${host}/api/bill/due-bills/${user_id}`);
      setDueBills(response.data);
    } catch (error) {
      console.error("Error fetching due bills:", error);
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

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
        {/* Left side: Image */}
        <div className="w-full md:w-1/2 p-4">
          <img src={home} alt="Home" className="w-full h-auto rounded-lg shadow-lg" />
        </div>

        {/* Right side: Due Bills Section */}
        <div className="w-full md:w-1/2 p-4 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Due Bills</h2>

            <div className="border border-gray-200 rounded-md mb-4">
              {dueBills.length === 0 ? (
                <p className="text-center text-gray-500">No due bills found</p>
              ) : (
                dueBills.slice(0, 3).map((bill) => {
                  const daysRemaining = Math.ceil(
                    (new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div key={bill.bill_id} className="p-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            {new Date(bill.billing_month).toLocaleString('default', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due on: {new Date(bill.due_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{parseFloat(bill.total_amount).toFixed(2)}</p>
                          {bill.status === 'unpaid' ? (
                            <p className="text-xs text-red-500">{daysRemaining} days remaining</p>
                          ) : (
                            <p className="text-xs text-green-500">Paid</p>
                          )}
                        </div>
                      </div>

                      {/* Pay Now Button */}
                      <div className="mt-3 text-center">
                        <button
                          className={`w-full p-2 rounded-md text-white ${
                            bill.status === 'unpaid' ? 'bg-orange-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => handlePayBill(bill.bill_id)}
                          disabled={bill.status === 'paid'}
                        >
                          {bill.status === 'paid' ? "Paid" : "Pay Now"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* View All Bills Button */}
            <div className="flex justify-end">
              <Link to="/bills" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Bills →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
