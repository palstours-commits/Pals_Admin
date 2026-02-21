"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVisa,
  updateVisa,
  clearVisaError,
  clearVisaMessage,
  getVisas,
} from "../../../store/slice/visasSlice";
import { notifyAlert } from "../../../utils/notificationService";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
  country: "",
  countryOfResidence: "",
  visaType: "",
  countryToVisit: "",
  travelStartDate: "",
  travelEndDate: "",
  message: "",
};

const visaTypeOptions = [
  { _id: "tourist", name: "Tourist Visa" },
  { _id: "visitor", name: "Visitor Visa" },
  { _id: "business", name: "Business Visa" },
  { _id: "transit", name: "Transit Visa" },
  { _id: "work", name: "Work Permit Visa" },
  { _id: "entry", name: "Entry Visa" },
  { _id: "conference", name: "Conference Visa" },
];

const CreateVisa = ({ visaData, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, error, message } = useSelector((state) => state.visas);

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (visaData) {
      setFormData({
        ...visaData,
        travelStartDate: visaData.travelStartDate?.split("T")[0],
        travelEndDate: visaData.travelEndDate?.split("T")[0],
      });
    }
  }, [visaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    visaData
      ? dispatch(updateVisa({ id: visaData._id, data: formData }))
      : dispatch(createVisa(formData));
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearVisaMessage());
      dispatch(getVisas());
      onClose();
    }
    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearVisaError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="mx-10">
      <div className="p-8 bg-white rounded-xl shadow">
        <h1 onClick={onClose} className="text-xl font-bold cursor-pointer mb-6">
          ← {visaData ? "Update Visa Enquiry" : "Create Visa Enquiry"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
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
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
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
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SingleSelectDropdown
                label="Visa Type"
                options={visaTypeOptions}
                value={formData.visaType}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, visaType: val }))
                }
                placeholder="Select Visa Type"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Country to Visit
              </label>
              <input
                name="countryToVisit"
                value={formData.countryToVisit}
                onChange={handleChange}
                placeholder="Country to Visit"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Travel Start Date
              </label>
              <input
                type="date"
                name="travelStartDate"
                value={formData.travelStartDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Travel End Date
              </label>
              <input
                type="date"
                name="travelEndDate"
                value={formData.travelEndDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
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
              placeholder="Additional Note"
              className="w-full border border-gray-300 rounded-md px-4 py-3"
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

export default CreateVisa;
