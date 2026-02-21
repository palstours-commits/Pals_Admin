"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createHotel,
  updateHotel,
  clearHotelError,
  clearHotelMessage,
  getHotels,
} from "../../../store/slice/HotelSlice";
import { notifyAlert } from "../../../utils/notificationService";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const initialForm = {
  name: "",
  email: "",
  phoneNo: "",
  countryOfResidence: "",
  destination: "",
  rooms: 1,
  roomType: "",
  checkInDate: "",
  checkOutDate: "",
  noOfAdults: 1,
  noOfChildren: 0,
  message: "",
};

const roomTypeOptions = [
  { _id: "premium", name: "Premium" },
  { _id: "standard", name: "Standard" },
  { _id: "luxury", name: "Luxury" },
];

const CreateHotel = ({ hotelData, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, error, message } = useSelector(
    (state) => state.hotels,
  );

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (hotelData) {
      setFormData({
        ...hotelData,
        checkInDate: hotelData.checkInDate?.split("T")[0],
        checkOutDate: hotelData.checkOutDate?.split("T")[0],
      });
    }
  }, [hotelData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    hotelData
      ? dispatch(updateHotel({ id: hotelData._id, data: formData }))
      : dispatch(createHotel(formData));
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearHotelMessage());
      dispatch(getHotels());
      onClose();
    }
    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearHotelError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="mx-10">
      <div className="p-8 bg-white rounded-xl shadow">
        <h1 onClick={onClose} className="text-xl font-bold cursor-pointer mb-6">
          ← {hotelData ? "Update Hotel Booking" : "Create Hotel Booking"}
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
                placeholder="Full Name"
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
                placeholder="Country of Residence"
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
                placeholder="Email"
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
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SingleSelectDropdown
                label="Room Type"
                options={roomTypeOptions}
                value={formData.roomType}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, roomType: val }))
                }
                placeholder="Select Room Type"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Number of Rooms
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                placeholder="Number of Rooms"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Destination
              </label>
              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Destination"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Number of Adults
              </label>
              <input
                name="noOfAdults"
                value={formData.noOfAdults}
                onChange={handleChange}
                placeholder="Adults"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
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
              placeholder="Additional Note"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-0"
            />
          </div>
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

export default CreateHotel;
