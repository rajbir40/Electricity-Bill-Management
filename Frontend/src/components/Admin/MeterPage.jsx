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
} from "lucide-react";
import axios from "axios";

const host = import.meta.env.VITE_BACKEND_HOST;

const MeterPage = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal and form fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("");
  const [ownerId, setOwnerId] = useState("");

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

  // Compute pagination values
  const totalMeters = meters.length;
  const totalPages = Math.ceil(totalMeters / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx   = startIdx + itemsPerPage;
  const currentMeters = meters.slice(startIdx, endIdx);

  const startItem = startIdx + 1;
  const endItem = Math.min(endIdx, totalMeters);

  // Helpers
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  const handleRegisterMeter = async () => {
    if (!meterNumber || !meterType || !ownerId) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post(`${host}/api/meter/add`, {
        meterNumber,
        metertype: meterType,
        user_id: Number(ownerId),
      });
      setIsModalOpen(false);
      fetchMeters(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error registering meter");
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Meter Management</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
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
                    {["Meter Number","Owner","Address","Type","Last Reading","Status","Actions"].map((h) => (
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
                          <Eye size={16} className="text-gray-600 hover:text-gray-800" />
                        </button>
                        <button title="Edit">
                          <Edit size={16} className="text-blue-600 hover:text-blue-800" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

                {/* Page numbers (you can adjust how many to show) */}
                {[...Array(totalPages)].slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                ).map((_, idx) => {
                  const pageNum = idx + Math.max(1, currentPage - 2);
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center border rounded ${
                        pageNum === currentPage
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Register New Meter</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Meter Number</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Meter Type</label>
                <select
                  className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={meterType}
                  onChange={(e) => setMeterType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Owner ID</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterMeter}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeterPage;
