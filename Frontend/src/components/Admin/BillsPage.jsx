import React, { useState, useEffect } from "react";
import { 
  Search, Plus, ChevronLeft, ChevronRight 
} from "lucide-react";
import axios from "axios";

const host = import.meta.env.VITE_BACKEND_HOST;

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // search / sort / filter state
  const [searchTerm,   setSearchTerm]   = useState("");
  const [sortField,    setSortField]    = useState("");
  const [sortOrder,    setSortOrder]    = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFine,   setFilterFine]   = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 10;

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${host}/api/bill/get-bills`);
        if (!res.ok) throw new Error("Failed to fetch bills");
        setBills(await res.json());
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchBills();
  }, []);

  // 1) sort
  const sorted = [...bills].sort((a,b) => {
    if (!sortField) return 0;
    let aF = a[sortField], bF = b[sortField];
    if (["billing_month","due_date","generated_at","fine_date"].includes(sortField)) {
      aF = aF ? new Date(aF) : 0;
      bF = bF ? new Date(bF) : 0;
    }
    if (["units_consumed","total_amount","fine_amount"].includes(sortField)) {
      aF = parseFloat(aF) || 0;
      bF = parseFloat(bF) || 0;
    }
    if (aF < bF) return sortOrder==="asc"? -1: 1;
    if (aF > bF) return sortOrder==="asc"?  1: -1;
    return 0;
  });

  // 2) filter status/fine
  let filtered = filterStatus
    ? sorted.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase())
    : sorted;
  if (filterFine !== "all") {
    filtered = filtered.filter(b => filterFine==="with" ? b.fine_id !== null : b.fine_id===null);
  }

  // 3) search
  const searched = filtered.filter(b => {
    const q = searchTerm.toLowerCase();
    return (
      String(b.bill_id).toLowerCase().includes(q) ||
      String(b.user_id).toLowerCase().includes(q) ||
      String(b.meter_id).toLowerCase().includes(q) ||
      (b.status||"").toLowerCase().includes(q) ||
      (b.fine_reason||"").toLowerCase().includes(q) ||
      new Date(b.billing_month).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  // 4) paginate
  const totalPages = Math.ceil(searched.length / billsPerPage);
  const startIdx   = (currentPage - 1) * billsPerPage;
  const currentBills = searched.slice(startIdx, startIdx + billsPerPage);

  const getStatusClass = s => {
    switch (s.toLowerCase()) {
      case "paid":   return "bg-green-100 text-green-800";
      case "unpaid": return "bg-red-100 text-red-800";
      default:       return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full space-y-6">
      {/* ─── TOP CONTROLS ─── */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bills…"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Sort By */}
        <select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="billing_month">Billing Month</option>
          <option value="units_consumed">Units Consumed</option>
          <option value="total_amount">Total Amount</option>
          <option value="due_date">Due Date</option>
          <option value="generated_at">Generated At</option>
          <option value="fine_amount">Fine Amount</option>
          <option value="fine_date">Fine Date</option>
        </select>

        {/* Order */}
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        {/* Fine Filter */}
        <select
          value={filterFine}
          onChange={e => setFilterFine(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Bills</option>
          <option value="with">With Fine</option>
          <option value="without">No Fine</option>
        </select>
      </div>

      {/* ─── CONTENT ─── */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* ─── TABLE ─── */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Bill ID", "User ID", "Meter ID", "Billing Month",
                    "Units", "Amount", "Due Date", "Status",
                    "Generated", "Fine Details"
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBills.length > 0 ? (
                  currentBills.map(bill => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {bill.bill_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bill.user_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bill.meter_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(bill.billing_month).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.units_consumed} kWh
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${bill.total_amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(bill.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(bill.generated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.fine_id ? (
                          <div>
                            <span className="font-medium text-red-600">${bill.fine_amount}</span>
                            <p className="text-xs text-gray-500 mt-1">{bill.fine_reason}</p>
                            <p className="text-xs text-gray-400">
                              Date: {new Date(bill.fine_date).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-green-600 text-xs">No fine</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                      No bills match “{searchTerm}”
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ─── PAGINATION ─── */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({searched.length} bills)
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
