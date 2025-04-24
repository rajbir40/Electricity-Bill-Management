import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Filter, Eye, Edit, CheckCircle, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_BACKEND_HOST;

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFine, setFilterFine] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const billsPerPage = 10;

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${host}/api/bill/get-bills`);
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchBills();
  }, []);

  // Sorting logic
  const sortedBills = [...bills].sort((a, b) => {
    if (!sortField) return 0;

    let aField = a[sortField];
    let bField = b[sortField];

    if (['billing_month', 'due_date', 'generated_at', 'fine_date'].includes(sortField)) {
      aField = aField ? new Date(aField) : new Date(0);
      bField = bField ? new Date(bField) : new Date(0);
    }

    if (['units_consumed', 'total_amount', 'fine_amount'].includes(sortField)) {
      aField = aField ? parseFloat(aField) : 0;
      bField = bField ? parseFloat(bField) : 0;
    }

    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtering logic
  let filteredBills = filterStatus
    ? sortedBills.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase())
    : sortedBills;

  if (filterFine !== 'all') {
    filteredBills = filteredBills.filter(b =>
      filterFine === 'with' ? b.fine_id !== null : b.fine_id === null
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);
  const startIdx   = (currentPage - 1) * billsPerPage;
  const endIdx     = startIdx + billsPerPage;
  const currentBills = filteredBills.slice(startIdx, endIdx);

  // Status badge helper
  const getStatusBadgeClass = status => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-full">
      {/* Filters & Sorting Panel */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sort Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600">Sort Options</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-grow">
                <label className="block text-xs text-gray-500 mb-1">Sort By</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  value={sortField}
                  onChange={e => setSortField(e.target.value)}
                >
                  <option value="">Select Field</option>
                  <option value="billing_month">Billing Month</option>
                  <option value="units_consumed">Units Consumed</option>
                  <option value="total_amount">Total Amount</option>
                  <option value="due_date">Due Date</option>
                  <option value="generated_at">Generated At</option>
                  <option value="fine_amount">Fine Amount</option>
                  <option value="fine_date">Fine Date</option>
                </select>
              </div>
              <div className="flex-grow">
                <label className="block text-xs text-gray-500 mb-1">Order</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600">Filter Options</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-grow">
                <label className="block text-xs text-gray-500 mb-1">Payment Status</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div className="flex-grow">
                <label className="block text-xs text-gray-500 mb-1">Fine Status</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filterFine}
                  onChange={e => setFilterFine(e.target.value)}
                >
                  <option value="all">All Bills</option>
                  <option value="with">With Fine</option>
                  <option value="without">Without Fine</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Error: {error}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bill ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Meter ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Billing Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fine Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBills.length > 0 ? (
                  currentBills.map(bill => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{bill.bill_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bill.user_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bill.meter_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(bill.billing_month).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bill.units_consumed} kWh</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${bill.total_amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(bill.due_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeClass(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(bill.generated_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.fine_id ? (
                          <div>
                            <span className="font-medium text-red-600">${bill.fine_amount}</span>
                            <p className="text-xs text-gray-500 mt-1">{bill.fine_reason}</p>
                            <p className="text-xs text-gray-400">Date: {new Date(bill.fine_date).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <span className="text-green-600 text-xs">No fine</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center text-gray-500">
                      No bills found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({filteredBills.length} bills)
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsPage;
