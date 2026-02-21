"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getFlights,
  deleteFlight,
  clearFlightError,
  clearFlightMessage,
} from "../../../store/slice/flightSlice";

import { notifyAlert } from "../../../utils/notificationService";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
import CreateFlight from "./CreateFlight";

const FlightBookingSection = () => {
  const dispatch = useDispatch();

  const {
    flights = [],
    actionLoading,
    deletedMessage,
    deletedError,
  } = useSelector((state) => state.adminFlight);

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getFlights());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Delete Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearFlightMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearFlightError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const filteredFlights = flights.filter((item) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();

    return (
      item.name?.toLowerCase().includes(search) ||
      item.email?.toLowerCase().includes(search) ||
      item.phoneNo?.includes(search) ||
      item.from?.toLowerCase().includes(search) ||
      item.to?.toLowerCase().includes(search) ||
      item.enquiryStatus?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlights = filteredFlights.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    await dispatch(deleteFlight(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      {openModal ? (
        <CreateFlight
          flightData={selectedFlight}
          onClose={() => {
            setOpenModal(false);
            setSelectedFlight(null);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Flight Booking List ({filteredFlights.length})
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by name, route, status..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-md text-sm w-64 focus:outline-none"
                />

                <button
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedFlight(null);
                  }}
                  className="bg-green-800 text-white px-6 py-2 rounded-md"
                >
                  + Create Flight
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded shadow overflow-x-auto"
            >
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>From</div>
                <div>To</div>
                <div>Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {currentFlights.length > 0 ? (
                currentFlights.map((flight, index) => (
                  <motion.div
                    key={flight._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-6 px-8 py-5 items-center text-sm"
                  >
                    <div className="font-medium">{flight.name}</div>
                    <div>{flight.from}</div>
                    <div>{flight.to}</div>
                    <div>
                      {new Date(flight.departureDate).toLocaleDateString()}
                    </div>

                    <div>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                          flight.enquiryStatus === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : flight.enquiryStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {flight.enquiryStatus}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <DotMenu
                        onEdit={() => {
                          setSelectedFlight(flight);
                          setOpenModal(true);
                        }}
                        onDelete={() => handleDeleteClick(flight._id)}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-8 py-10 text-center text-gray-500">
                  No flight bookings found
                </div>
              )}

              <div className="flex justify-between items-center px-8 py-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredFlights.length)}{" "}
                  of {filteredFlights.length}
                </p>

                <div className="flex gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button className="w-10 h-10 rounded-lg bg-green-800 text-white">
                    {currentPage}
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this flight booking?"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default FlightBookingSection;
