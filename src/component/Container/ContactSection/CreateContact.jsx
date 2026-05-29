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

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED", "RESOLVED"];

const ACCOMMODATION_OPTIONS = [
  { _id: "Not Yet Decided", name: "Not Yet Decided" },
  { _id: "Only HomeStays/Bead & Breakfast", name: "Only HomeStays/Bead & Breakfast" },
  { _id: "Budget Hotels", name: "Budget Hotels" },
  { _id: "3 Star Hotels/ HouseBoat", name: "3 Star Hotels/ HouseBoat" },
  { _id: "4 Star Hotels/ HouseBoat", name: "4 Star Hotels/ HouseBoat" },
  { _id: "Luxury 5 Star Hotels/ HouseBoat", name: "Luxury 5 Star Hotels/ HouseBoat" },
  { _id: "HouseBoat Day Cruise", name: "HouseBoat Day Cruise" },
  { _id: "HouseBoat Overnight Stay & Cruise", name: "HouseBoat Overnight Stay & Cruise" },
];

const CreateContact = ({ contactData, onClose }) => {
  const dispatch = useDispatch();

  const { actionLoading, error, message } = useSelector(
    (state) => state.contactus
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    tentativeArrivalDate: "",
    numberOfNights: "",
    accommodationType: "",
    message: "",
    contactUsStatus: "PENDING",
  });

  useEffect(() => {
    if (contactData) {
      setFormData({
        firstName: contactData?.firstName || "",
        lastName: contactData?.lastName || "",
        email: contactData?.email || "",
        mobile: contactData?.mobile || "",
        tentativeArrivalDate: contactData?.tentativeArrivalDate
          ? contactData.tentativeArrivalDate.split("T")[0]
          : "",
        numberOfNights: contactData?.numberOfNights || "",
        accommodationType: contactData?.accommodationType || "",
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
    const payload = {
      ...formData,
      numberOfNights: formData.numberOfNights ? Number(formData.numberOfNights) : "",
    };
    if (contactData) {
      dispatch(updateContact({ id: contactData._id, data: payload }));
    } else {
      dispatch(createContact(payload));
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
              <label className="text-sm font-medium block mb-1">First Name *</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Last Name *</label>
              <input
                name="lastName"
                value={formData.lastName}
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
              <label className="text-sm font-medium block mb-1">Tentative Arrival Date</label>
              <input
                type="date"
                name="tentativeArrivalDate"
                value={formData.tentativeArrivalDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Number of Nights</label>
              <input
                type="number"
                name="numberOfNights"
                value={formData.numberOfNights}
                onChange={handleChange}
                min={1}
                max={99}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Accommodation Type</label>
              <select
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0 bg-white"
              >
                <option value="">Select Type of Stay</option>
                {ACCOMMODATION_OPTIONS.map((opt) => (
                  <option key={opt._id} value={opt._id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {contactData && (
              <div>
                <label className="text-sm font-medium block mb-1">Status</label>
                <select
                  name="contactUsStatus"
                  value={formData.contactUsStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
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