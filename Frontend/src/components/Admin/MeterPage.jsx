import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import axios from "axios";

const host = import.meta.env.VITE_BACKEND_HOST;

const MeterPage = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal and form fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("");
  const [userId, setUserId] = useState("");

  const [isRegistering,setisRegistering] = useState(false);

  // Fetch all meters
  const fetchMeters = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${host}/api/meter/details`);
      setMeters(resp.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load meters.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  // Filter meters by search term (number, owner, address, type)
  const filteredMeters = meters.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      String(m.MeterNumber).toLowerCase().includes(q) ||
      m.FullName.toLowerCase().includes(q) ||
      m.Address.toLowerCase().includes(q) ||
      m.MeterType.toLowerCase().includes(q)
    );
  });

  // Pagination calculations based on filtered list
  const totalMeters = filteredMeters.length;
  const totalPages = Math.ceil(totalMeters / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentMeters = filteredMeters.slice(startIdx, endIdx);

  const startItem = totalMeters === 0 ? 0 : startIdx + 1;
  const endItem = Math.min(endIdx, totalMeters);

  // Sliding window of up to 3 pages
  const maxPagesToShow = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Helper for initials
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0].toUpperCase())
          .join("")
      : "?";

  const handleRegisterMeter = async () => {
    if (!meterNumber || !meterType || !userId) {
      alert("Please fill all fields");
      return;
    }
    console.log(meterNumber);
    console.log(meterType);
    console.log(userId);
    try {
      await axios.post(`${host}/api/meter/add`, {
        meterNumber,
        meterType,
        user_id: Number(userId),
      });
      setIsModalOpen(false);
      fetchMeters();
    } catch (err) {
      console.error(err);
      alert("Error registering meter");
    }
  };

  return (
    <div className="h-full">
      {/* Header with Search + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Meter Management</h1>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meter"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button> */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border-blue-600 rounded hover:bg-blue-700"
          >
            <Plus size={16} /> Register New Meter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    {[
                      "Meter Number",
                      "Owner",
                      "Address",
                      "Type",
                      "Last Reading",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentMeters.map((m) => (
                    <tr key={m.meter_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {m.MeterNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                          {getInitials(m.FullName)}
                        </div>
                        <span className="text-sm text-gray-700">
                          {m.FullName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {m.Address}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {m.MeterType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        543.7 kWh
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button title="View">
                          <Eye
                            size={16}
                            className="text-gray-600 hover:text-gray-800"
                          />
                        </button>
                        <button title="Edit">
                          <Edit
                            size={16}
                            className="text-blue-600 hover:text-blue-800"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredMeters.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-6 text-center text-gray-500"
                      >
                        No meters match “{searchTerm}”
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startItem}-{endItem} of {totalMeters} meters
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 flex items-center justify-center border rounded ${
                      num === currentPage
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Register Meter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Register New Meter
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Meter Number */}
              <div>
                <label
                  htmlFor="meter-number"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Meter Number
                </label>
                <input
                  id="meter-number"
                  type="text"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meter number"
                  disabled={isRegistering}
                />
              </div>

              {/* Meter Type */}
              <div>
                <label
                  htmlFor="meter-type"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Meter Type
                </label>
                <select
                  id="meter-type"
                  value={meterType}
                  onChange={(e) => setMeterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isRegistering}
                >
                  <option value="">Select meter type</option>
                  <option value="residential">residential</option>
                  <option value="industrial">industrial</option>
                  <option value="commercial">commercial</option>
                </select>
              </div>

              {/* User ID */}
              <div>
                <label
                  htmlFor="user-id"
                  className="block mb-2 font-medium text-gray-700"
                >
                  User ID
                </label>
                <input
                  id="user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter user ID"
                  disabled={isRegistering}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
                disabled={isRegistering}
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterMeter}
                className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center min-w-[100px] ${
                  isRegistering
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeterPage;
