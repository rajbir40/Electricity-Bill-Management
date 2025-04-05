import React, { useState, useEffect } from 'react';

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');

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
      if (['billing_month', 'due_date', 'generated_at'].includes(sortField)) {
        aField = new Date(aField);
        bField = new Date(bField);
      }

      // Convert numeric strings to numbers for sorting
      if (['units_consumed', 'total_amount'].includes(sortField)) {
        aField = parseFloat(aField);
        bField = parseFloat(bField);
      }

      if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Filter bills by status if a filter is selected
  const filteredBills = filterStatus
    ? sortedBills.filter(bill => bill.status.toLowerCase() === filterStatus.toLowerCase())
    : sortedBills;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bills</h1>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Sorting Controls */}
        <div className="flex items-center space-x-2">
          <label className="font-medium">Sort By:</label>
          <select
            className="p-2 border rounded"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Select Field</option>
            <option value="billing_month">Billing Month</option>
            <option value="units_consumed">Units Consumed</option>
            <option value="total_amount">Total Amount</option>
            <option value="due_date">Due Date</option>
            <option value="generated_at">Generated At</option>
          </select>
          <select
            className="p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {/* Filter Control */}
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <label className="font-medium">Filter by Status:</label>
          <select
            className="p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Display Loading, Error, or Data Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Bill ID</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Meter ID</th>
                <th className="px-4 py-2 border">Billing Month</th>
                <th className="px-4 py-2 border">Units Consumed</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Generated At</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(bill => (
                <tr key={bill.bill_id}>
                  <td className="px-4 py-2 border">{bill.bill_id}</td>
                  <td className="px-4 py-2 border">{bill.user_id}</td>
                  <td className="px-4 py-2 border">{bill.meter_id}</td>
                  <td className="px-4 py-2 border">
                    {new Date(bill.billing_month).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{bill.units_consumed}</td>
                  <td className="px-4 py-2 border">{bill.total_amount}</td>
                  <td className="px-4 py-2 border">
                    {new Date(bill.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{bill.status}</td>
                  <td className="px-4 py-2 border">
                    {new Date(bill.generated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillPage;
