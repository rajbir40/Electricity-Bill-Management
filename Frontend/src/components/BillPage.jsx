import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFine, setFilterFine] = useState('all');

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/bill/get-bills');
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
    if (sortField) {
      let aField = a[sortField];
      let bField = b[sortField];

      // Convert dates to Date objects for comparison
      if (['billing_month', 'due_date', 'generated_at', 'fine_date'].includes(sortField)) {
        aField = aField ? new Date(aField) : new Date(0);
        bField = bField ? new Date(bField) : new Date(0);
      }

      // Convert numeric strings to numbers for sorting
      if (['units_consumed', 'total_amount', 'fine_amount'].includes(sortField)) {
        aField = aField ? parseFloat(aField) : 0;
        bField = bField ? parseFloat(bField) : 0;
      }

      if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Filter bills by status and fine presence if filters are selected
  let filteredBills = filterStatus
    ? sortedBills.filter(bill => bill.status.toLowerCase() === filterStatus.toLowerCase())
    : sortedBills;

  if (filterFine !== 'all') {
    filteredBills = filteredBills.filter(bill =>
      filterFine === 'with' ? bill.fine_id !== null : bill.fine_id === null
    );
  }

  // Helper function for status badge styling
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 bg-orange-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Bills Management</h1>
          <div className="text-sm text-gray-500">
            {filteredBills.length} {filteredBills.length === 1 ? 'bill' : 'bills'} found
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filters & Sorting</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sorting Controls */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Sort Options</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-grow">
                  <label className="block text-xs text-gray-500 mb-1">Sort By</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="flex-grow">
                  <label className="block text-xs text-gray-500 mb-1">Fine Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={filterFine}
                    onChange={(e) => setFilterFine(e.target.value)}
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

        {/* Display Loading, Error, or Data Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Meter ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Bill ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Billing Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Units</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Fine Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.length > 0 ? (
                    filteredBills.map(bill => (
                      <tr key={bill.bill_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.bill_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.user_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.meter_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bill.billing_month).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.units_consumed} kWh</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${bill.total_amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bill.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(bill.status)}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bill.generated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            
            {filteredBills.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {filteredBills.length} out of {bills.length} total bills
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillPage;