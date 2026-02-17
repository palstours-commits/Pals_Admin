"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEnquiry,
  updateEnquiry,
  clearEnquiryError,
  clearEnquiryMessage,
} from "../../../store/slice/enquirySlice";
import { notifyAlert } from "../../../utils/notificationService";
import { getPackages } from "../../../store/slice/packageSlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const CreateEnquiry = ({ enquiryData, onClose }) => {
  const dispatch = useDispatch();

  const { actionLoading, error, message } = useSelector(
    (state) => state.enquiry,
  );

  const { packages } = useSelector((state) => state.package);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    packageId: "",
    numberOfPersons: 1,
    specialRequest: "",
    status: 1,
  });

  useEffect(() => {
    if (enquiryData) {
      setFormData({
        name: enquiryData?.name || "",
        phone: enquiryData?.phone || "",
        email: enquiryData?.email || "",
        date: enquiryData?.date?.slice(0, 10) || "",
        packageId: enquiryData?.packageId._id || "",
        numberOfPersons: enquiryData?.numberOfPersons || 1,
        specialRequest: enquiryData?.specialRequest || "",
        status: enquiryData?.status ?? 1,
      });
    }
  }, [enquiryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (enquiryData?._id) {
      dispatch(
        updateEnquiry({
          id: enquiryData._id,
          data: formData,
        }),
      );
    } else {
      dispatch(createEnquiry(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearEnquiryMessage());
      onClose();
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearEnquiryError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="m-6">
      <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow">
        <h1
          className="text-2xl font-bold mb-6 pb-4 cursor-pointer"
          onClick={onClose}
        >
          ← {enquiryData ? "Update Enquiry" : "Create Enquiry"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 sticky top-24 self-start">
              <div>
                <label className="text-sm font-medium mb-1 block">Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Travel Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Special Request
                </label>
                <textarea
                  rows={4}
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full outline-0"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Package *
                </label>

                <SingleSelectDropdown
                  options={packages}
                  value={formData.packageId}
                  onChange={(value) =>
                    setFormData({ ...formData, packageId: value })
                  }
                  labelKey="packageName"
                  searchable
                  placeholder="Select Package"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Number of Persons *
                </label>
                <input
                  type="number"
                  name="numberOfPersons"
                  value={formData.numberOfPersons}
                  onChange={handleChange}
                  min={1}
                  className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6">
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
              {actionLoading ? "Please wait..." : "Save Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEnquiry;
