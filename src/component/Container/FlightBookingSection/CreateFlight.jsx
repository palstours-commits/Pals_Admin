"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFlight,
  updateFlight,
  clearFlightError,
  clearFlightMessage,
} from "../../../store/slice/flightSlice";
import { notifyAlert } from "../../../utils/notificationService";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const CreateFlight = ({ flightData, onClose }) => {
  const dispatch = useDispatch();

  const { actionLoading, error, message } = useSelector(
    (state) => state.adminFlight,
  );

  const [formData, setFormData] = useState({
    name: "",
    countryOfResidence: "",
    email: "",
    phoneNo: "",
    flightType: "",
    noOfAdults: 1,
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    message: "",
  });

  useEffect(() => {
    if (flightData) {
      setFormData({
        name: flightData?.name || "",
        countryOfResidence: flightData?.countryOfResidence || "",
        email: flightData?.email || "",
        phoneNo: flightData?.phoneNo || "",
        flightType: flightData?.flightType || "",
        noOfAdults: flightData?.noOfAdults || 1,
        from: flightData?.from || "",
        to: flightData?.to || "",
        departureDate: flightData?.departureDate
          ? flightData.departureDate.split("T")[0]
          : "",
        returnDate: flightData?.returnDate
          ? flightData.returnDate.split("T")[0]
          : "",
        message: flightData?.message || "",
      });
    }
  }, [flightData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (flightData) {
      dispatch(
        updateFlight({
          id: flightData._id,
          data: formData,
        }),
      );
    } else {
      dispatch(createFlight(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Success",
        message,
        type: "success",
      });
      dispatch(clearFlightMessage());
      onClose();
    }

    if (error) {
      notifyAlert({
        title: "Error",
        message: error,
        type: "error",
      });
      dispatch(clearFlightError());
    }
  }, [message, error, dispatch, onClose]);

  const flightTypeOptions = [
    { _id: "Economic", name: "Economic" },
    { _id: "First Class", name: "First Class" },
  ];

  return (
    <div className="mx-20">
      <div className="p-8 max-w-7xl mx-auto bg-white rounded shadow">
        <h1
          className="text-2xl font-bold mb-6 pb-4 cursor-pointer"
          onClick={onClose}
        >
          ← {flightData ? "Update Flight Enquiry" : "Create Flight Enquiry"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Country of Residence
              </label>
              <input
                type="text"
                name="countryOfResidence"
                value={formData.countryOfResidence}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleSelectDropdown
              label="Flight Type"
              options={flightTypeOptions}
              value={formData.flightType}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, flightType: val }))
              }
              placeholder="Select Flight Type"
            />
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Number of Adults
              </label>
              <input
                type="number"
                name="noOfAdults"
                value={formData.noOfAdults}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="From"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
            />
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="To"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
            />
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
            />
          </div>
          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional Note"
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none"
          />

          <div className="flex justify-end">
            <button
              disabled={actionLoading}
              className="px-10 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-4 rounded-full cursor-pointer"
            >
              {actionLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlight;
