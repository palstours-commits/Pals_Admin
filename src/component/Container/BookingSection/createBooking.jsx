"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createBooking,
    updateBooking,
    clearBookingError,
    clearBookingMessage,
} from "../../../store/slice/bookingSlice";
import { notifyAlert } from "../../../utils/notificationService";
import { getPackages } from "../../../store/slice/packageSlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const CreateBooking = ({ bookingData, onClose }) => {
    const dispatch = useDispatch();

    const { actionLoading, error, message } = useSelector(
        (state) => state.booking
    );

    const { packages } = useSelector((state) => state.package);

    useEffect(() => {
        dispatch(getPackages());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        country: "",
        destinationOrPackage: "",
        numberOfPersons: 1,
        departureDate: "",
        returnDate: "",
        numberOfDaysPreference: "",
        specialRequest: "",
        status: 1,
    });

    useEffect(() => {
  if (bookingData) {
    setFormData({
      firstName: bookingData?.firstName || "",
      lastName: bookingData?.lastName || "",
      email: bookingData?.email || "",
      mobile: bookingData?.mobile || "",
      country: bookingData?.country || "",

      destinationOrPackage:
        typeof bookingData?.destinationOrPackage === "object"
          ? bookingData.destinationOrPackage._id
          : bookingData?.destinationOrPackage || "",

      numberOfPersons: bookingData?.numberOfPersons || 1,
      departureDate: bookingData?.departureDate?.slice(0, 10) || "",
      returnDate: bookingData?.returnDate?.slice(0, 10) || "",
      numberOfDaysPreference:
        bookingData?.numberOfDaysPreference || "",
      specialRequest: bookingData?.specialRequest || "",
      status: bookingData?.status ?? 1,
    });
  }
}, [bookingData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (bookingData?._id) {
            dispatch(updateBooking({ id: bookingData._id, data: formData }));
        } else {
            dispatch(createBooking(formData));
        }
    };

    useEffect(() => {
        if (message) {
            notifyAlert({ title: "Success", message, type: "success" });
            dispatch(clearBookingMessage());
            onClose();
        }

        if (error) {
            notifyAlert({ title: "Error", message: error, type: "error" });
            dispatch(clearBookingError());
        }
    }, [message, error, dispatch, onClose]);

    return (

        <div className="m-6">
            <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow">
                <h1
                    className="text-2xl font-bold mb-6 pb-4 cursor-pointer"
                    onClick={onClose}
                >
                    ← {bookingData ? "Update Booking" : "Create Booking"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    First Name *
                                </label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Last Name *
                                </label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
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
                                <label className="text-sm font-medium mb-1 block">Mobile *</label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Country *
                                </label>
                                <input
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="py-2 border outline-0 border-gray-300 rounded-md w-full ps-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Departure Date *
                                </label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleChange}
                                    className="py-2 border border-gray-300 rounded-md w-full ps-2 outline-0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Return Date *
                                </label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
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
                                <label className="text-sm font-medium mb-1 block">Package *</label>
                                <SingleSelectDropdown
                                    options={packages}
                                    value={formData.destinationOrPackage}
                                    onChange={(value) =>
                                        setFormData({ ...formData, destinationOrPackage: value })
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

                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Number of Days Preference
                                </label>
                                <input
                                    type="text"
                                    name="numberOfDaysPreference"
                                    value={formData.numberOfDaysPreference}
                                    onChange={handleChange}
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
                            {actionLoading ? "Please wait..." : "Save Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBooking;
