import React, { useState } from "react";
import axios from "axios";
const host = import.meta.env.VITE_BACKEND_HOST;

export default function EditForm({ user, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    fullName: user.fullName,
    email:    user.email,
    phone:    user.phone,
    address:     user.address,
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${host}/api/user/update/${user.user_id}`, form);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Edit User</h2>

      <div>
        <label className="block text-sm">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm">address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb", // Tailwind bg-blue-600
            color: "white",
            borderRadius: "0.375rem",   // Tailwind rounded
            cursor: "pointer"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"} // Tailwind hover:bg-blue-700
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          
        >
          Save
        </button>
      </div>
    </form>
  );
}
