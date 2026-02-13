"use client";
import { X } from "lucide-react";
import { useState } from "react";

const ServiceStatusModal = ({ service, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: service?.name || "",
    status: service?.status || "Active",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!form.name) {
      alert("Service name is required");
      return;
    }

    onUpdate({ ...service, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded shadow-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">
            {service ? "Update Menu" : "Create Menu"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Menu Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter menu name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none 
                         focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Status</label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={form.status === "Active"}
                  onChange={handleChange}
                  className="accent-green-700"
                />
                <span className="text-green-700 font-medium">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={form.status === "Inactive"}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                <span className="text-red-600 font-medium">Inactive</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 ">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusModal;
