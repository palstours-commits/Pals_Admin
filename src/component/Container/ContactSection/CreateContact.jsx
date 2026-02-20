"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  updateContact,
  clearContactError,
  clearContactMessage,
} from "../../../store/slice/contactusSlice";
import { notifyAlert } from "../../../utils/notificationService";

const CreateContact = ({ contactData, onClose }) => {
  const dispatch = useDispatch();

  const { actionLoading, error, message } = useSelector(
    (state) => state.contactus,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    message: "",
  });

  useEffect(() => {
    if (contactData) {
      setFormData({
        name: contactData?.name || "",
        email: contactData?.email || "",
        mobile: contactData?.mobile || "",
        country: contactData?.country || "",
        message: contactData?.message || "",
        contactUsStatus: contactData?.contactUsStatus || "PENDING",
      });
    }
  }, [contactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contactData) {
      dispatch(
        updateContact({
          id: contactData._id,
          data: formData,
        }),
      );
    } else {
      dispatch(createContact(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Success",
        message,
        type: "success",
      });
      dispatch(clearContactMessage());
      onClose();
    }

    if (error) {
      notifyAlert({
        title: "Error",
        message: error,
        type: "error",
      });
      dispatch(clearContactError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="m-6">
      <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow">
        <h1
          className="text-2xl font-bold mb-6 pb-4 cursor-pointer"
          onClick={onClose}
        >
          ← {contactData ? "Update Contact" : "Create Contact"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Mobile *</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Message</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              {actionLoading ? "Please wait..." : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContact;
