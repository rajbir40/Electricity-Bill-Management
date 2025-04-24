import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, FileText, BarChart2, Settings, Bell, Search, Home, LogOut, Plus,
  Calendar, Download, Filter, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Clock,
} from "lucide-react";
import axios from "axios";
import UserPage from "./UserPage";
import MeterPage from "./MeterPage";
import BillPage from "./BillsPage";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import { useNavigate } from 'react-router-dom';


const host = import.meta.env.VITE_BACKEND_HOST;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userCount, setUserCount] = useState(0);
  const [pendingBillsCount, setPendingBillsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [recentBills, setRecentBills] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

    const navigate = useNavigate();


  useEffect(() => {
    fetchUserCount();
    fetchPendingBillsCount();
    fetchRevenue();
    fetchDueAmount();
    fetchRecentBills();
    fetchActivityLogs();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get(`${host}/api/user/count`);
      setUserCount(response.data[0].count);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchPendingBillsCount = async () => {
    try {
      const response = await axios.get(`${host}/api/bill/count-pending`);
      setPendingBillsCount(response.data[0].count);
    } catch (error) {
      console.error("Error fetching pending bills count:", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${host}/api/payment/revenue`);
      setRevenue(response.data.total_revenue);
    } catch (error) {
      console.error("Error fetching revenue:", error);
    }
  };

  const fetchDueAmount = async () => {
    try {
      const response = await axios.get(`${host}/api/payment/due-amount`);
      setDueAmount(response.data.due_amount);
    } catch (error) {
      console.error("Error fetching due amount:", error);
    }
  };

  const fetchRecentBills = async () => {
    try {
      const response = await axios.get(`${host}/api/bill/latest-bills`);
      setRecentBills(response.data);
    } catch (error) {
      console.error("Error fetching recent bills:", error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await axios.get(`${host}/api/log/fetch`);
      setActivityLogs(response.data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    console.log("logout successfull")
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <div className="bg-blue-600 w-64 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-2xl font-bold">E-Bill Admin</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "dashboard" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "users" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <Users size={18} />
                <span>Users</span>
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "meters" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("meters")}
              >
                <FileText size={18} />
                <span>Meter Management</span>
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "bills" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("bills")}
              >
                <FileText size={18} />
                <span>Bills & Payments</span>
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "reports" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("reports")}
              >
                <BarChart2 size={18} />
                <span>Reports & Analytics</span>
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  activeTab === "notifications" ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="p-6 border-t border-blue-500">
          <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all duration-200" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center w-1/3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell size={22} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    3
                  </span>
                </button>
              </div>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="text-lg font-bold">A</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 mt-2 shadow-lg bg-white rounded-lg w-52 border border-gray-200"
                >
                  <li>
                    <a className="px-4 py-2 hover:bg-gray-100 text-gray-700">Profile</a>
                  </li>
                  <li>
                    <a className="px-4 py-2 hover:bg-gray-100 text-gray-700">Settings</a>
                  </li>
                  <li className="border-t border-gray-100 mt-1 pt-1">
                    <a className="px-4 py-2 hover:bg-gray-100 text-red-600">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "dashboard" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString()}</span>
                    </button>
                  {/* <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                    <Download size={16} />
                    <span>Export</span>
                  </button> */}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BarChart2 size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(revenue)}</h3>
                      <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <Users size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-800">{userCount}</h3>
                      <p className="text-xs text-green-600 mt-1">↑ 237 new this month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <AlertTriangle size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Pending Bills</p>
                      <h3 className="text-2xl font-bold text-gray-800">{pendingBillsCount}</h3>
                      <p className="text-xs text-amber-600 mt-1">425 bills awaiting payment</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <Clock size={24} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Due Amount</p>
                      <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(dueAmount)}</h3>
                      <p className="text-xs text-red-600 mt-1">124 bills overdue</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bills and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Bills</h2>
                    <Button onClick={setActiveTab("bills")} className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      View All
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bill ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentBills.map((bill) => (
                          <tr key={bill.bill_id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              #{bill.bill_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              User #{bill.user_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatCurrency(bill.total_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {bill.status === "paid" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" />
                                  Paid
                                </span>
                              )}
                              {bill.status === "unpaid" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  <Clock size={12} className="mr-1" />
                                  Pending
                                </span>
                              )}
                              {bill.status === "overdue" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertTriangle size={12} className="mr-1" />
                                  Overdue
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Activity Log</h2>
                    <a className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer">
                      View All
                    </a>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      {activityLogs.slice(0, 4).map((log, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {log.details.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">Activity Update</p>
                            <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                            <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && <UserPage />}
          {activeTab === "bills" && <BillPage />}
          {activeTab === "meters" && <MeterPage />}
          {activeTab === "reports" && <Analytics />}
          {activeTab === "notifications" && <Notifications />}
        </main>
      </div>
    </div>
  );
}