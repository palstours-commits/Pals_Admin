"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

import {
  getBookings,
  deleteBooking,
  clearBookingError,
  clearBookingMessage,
} from "../../../store/slice/bookingSlice";

import CreateBooking from "./createBooking";

const BookingSection = () => {
  const dispatch = useDispatch();

  const { bookings, loading, deletedMessage, deletedError } = useSelector(
    (state) => state.booking,
  );

  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectData, setSelectData] = useState(null);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearBookingMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Error",
        message: deletedError,
        type: "error",
      });
      dispatch(clearBookingError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteBooking(deleteId)).unwrap();

      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      {openModal ? (
        <CreateBooking
          bookingData={selectData}
          onClose={() => {
            setOpenModal(false);
            setSelectData(null);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Bookings ({bookings?.length || 0})
              </h2>

              <button
                onClick={() => {
                  setSelectData(null);
                  setOpenModal(true);
                }}
                className="bg-green-800 text-white px-6 py-2 rounded-md"
              >
                + Create Booking
              </button>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Persons</th>
                    <th className="px-4 py-3">Departure</th>
                    <th className="px-4 py-3">Return</th>
                    <th className="px-4 py-3">Days</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings?.length > 0 ? (
                    bookings.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-300 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.firstName} {item.lastName}
                        </td>

                        <td className="px-4 py-4 break-all max-w-[200px]">
                          {item.email}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.mobile}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.country}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.numberOfPersons}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatIndianDateTime(item.departureDate)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatIndianDateTime(item.returnDate)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.numberOfDaysPreference}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                            {item.bookingStatus}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <DotMenu
                            onEdit={() => {
                              setSelectData(item);
                              setOpenModal(true);
                            }}
                            onDelete={() => {
                              setDeleteId(item._id);
                              setConfirmOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-10 text-gray-500"
                      >
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this booking?"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default BookingSection;
