"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransport,
  updateTransport,
  clearTransportError,
  clearTransportMessage,
  getTransports,
} from "../../../store/slice/transportSlice";
import { notifyAlert } from "../../../utils/notificationService";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const initialForm = {
  name: "",
  email: "",
  phoneNo: "",
  countryOfResidence: "",
  rentalType: "",
  carType: "",
  location: "",
  startDate: "",
  endDate: "",
  noOfAdults: 1,
  noOfChildren: 0,
  message: "",
};

const rentalTypeOptions = [
  { _id: "airport", name: "Airport Pickup / Drop" },
  { _id: "city", name: "One Day City Hire" },
  { _id: "outstation", name: "Outstation Hire" },
  { _id: "others", name: "Others" },
];

const carTypeOptions = [
  { _id: "4_seater", name: "4 Seater" },
  { _id: "5_seater", name: "5 Seater" },
  { _id: "7_seater", name: "7 Seater" },
  { _id: "7_seater_plus", name: "7 Seater+" },
];

const CreateTransport = ({ transportData, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, error, message } = useSelector(
    (state) => state.transports,
  );

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (transportData) {
      setFormData({
        ...transportData,
        startDate: transportData.startDate?.split("T")[0],
        endDate: transportData.endDate?.split("T")[0],
      });
    }
  }, [transportData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    transportData
      ? dispatch(updateTransport({ id: transportData._id, data: formData }))
      : dispatch(createTransport(formData));
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearTransportMessage());
      dispatch(getTransports());
      onClose();
    }
    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearTransportError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="mx-10">
      <div className="p-8 bg-white rounded-xl shadow">
        <h1 onClick={onClose} className="text-xl font-bold cursor-pointer mb-6">
          ←{" "}
          {transportData
            ? "Update Transport Booking"
            : "Create Transport Booking"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Country of Residence
              </label>
              <input
                name="countryOfResidence"
                value={formData.countryOfResidence}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <input
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleSelectDropdown
              label="Rental Type"
              options={rentalTypeOptions}
              value={formData.rentalType}
              onChange={(val) =>
                setFormData((p) => ({ ...p, rentalType: val }))
              }
              placeholder="Select Rental Type"
            />

            <SingleSelectDropdown
              label="Car Type"
              options={carTypeOptions}
              value={formData.carType}
              onChange={(val) => setFormData((p) => ({ ...p, carType: val }))}
              placeholder="Select Car Type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Pickup Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Number of Adults
              </label>
              <input
                type="number"
                name="noOfAdults"
                value={formData.noOfAdults}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 say text-sm font-medium text-gray-500">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-500">
              Additional Note
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={actionLoading}
              className="px-10 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-4 rounded-full"
            >
              {actionLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransport;
