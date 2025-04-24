import React, { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from "lucide-react";
import axios from "axios";

import Modal from "./Modal";
import EditForm from "./EditForm";

const host = import.meta.env.VITE_BACKEND_HOST;

const UserPage = () => {
  // data + UI state
  const [users, setUsers]           = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // modal state
  const [modalType, setModalType]   = useState(null); // "view" | "edit" | "delete" | null
  const [selectedUser, setSelectedUser] = useState(null);

  // fetch utility
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${host}/api/user/fetch`);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // filtering + pagination
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      String(u.phone).toLowerCase().includes(q)
    );
  });

  const itemsPerPage = 10;
  const totalUsers   = filteredUsers.length;
  const totalPages   = Math.ceil(totalUsers / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = totalUsers === 0
    ? 0
    : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalUsers);

  // sliding window of pages (up to 3)
  const maxPagesToShow = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage   = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // helpers
  const getInitials = (name) =>
    name
      .split(" ")
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase();

  const isModalOpen = modalType !== null && selectedUser !== null;

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          {/* Add New */}
          <button
            onClick={() => {
              setSelectedUser({ fullName: "", email: "", phone: "", role: ""  , password:""});
              setModalType("edit");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 text-white text-sm"
          >
            <Plus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3">
                  <input type="checkbox" className="form-checkbox" />
                </th>
                {["Name","Email","Phone No.","Actions"].map((h) => (
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
              {paginatedUsers.map((u) => (
                <tr key={u.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="form-checkbox" />
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                      {getInitials(u.fullName)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {u.fullName}
                      </div>
                      <div className="text-xs text-gray-500">{u.role}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("view");
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("edit");
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("delete");
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {totalUsers === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No users match “{searchTerm}”
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {startItem}-{endItem} of {totalUsers} users
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 border rounded-md disabled:opacity-50"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 border rounded-md disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 border rounded-md ${
                  n === currentPage
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border rounded-md disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border rounded-md disabled:opacity-50"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View / Edit / Delete Modals */}
      {isModalOpen && (
        <Modal onClose={() => setModalType(null)}>
          {modalType === "view" && (
            <>
              <h2 className="text-xl font-semibold mb-4">View User</h2>
              <p><strong>Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              
              <button
                onClick={() => setModalType(null)}
                className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </>
          )}

          {modalType === "edit" && (
            <EditForm
              user={selectedUser}
              onSuccess={() => {
                setModalType(null);
                fetchUsers();
              }}
              onCancel={() => setModalType(null)}
            />
          )}

          {modalType === "delete" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Delete User?</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{selectedUser.fullName}</strong>?
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await axios.delete(
                      `${host}/api/user/delete?userid=${selectedUser.user_id}`
                    );
                    setModalType(null);
                    fetchUsers();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
