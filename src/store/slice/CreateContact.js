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
    contactUsStatus: "PENDING",
  });

  useEffect(() => {
    if (contactData) {
      setFormData({
        name: contactData.name || "",
        email: contactData.email || "",
        mobile: contactData.mobile || "",
        country: contactData.country || "",
        message: contactData.message || "",
        contactUsStatus: contactData.contactUsStatus || "PENDING",
      });
    }
  }, [contactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contactData?._id) {
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
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearContactMessage());
      onClose();
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearContactError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="m-6">
      <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
        <h1
          className="text-2xl font-bold mb-6 cursor-pointer"
          onClick={onClose}
        >
          ← {contactData ? "Update Contact" : "Create Contact"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full border p-2 rounded"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows={4}
            className="w-full border p-2 rounded"
          />

          <select
            name="contactUsStatus"
            value={formData.contactUsStatus}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white rounded"
            >
              {actionLoading ? "Please wait..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContact;
