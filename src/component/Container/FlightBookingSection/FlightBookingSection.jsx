"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearFlightError,
  clearFlightMessage,
  deleteFlight,
  getFlights,
  updateFlight,
} from "../../../store/slice/flightSlice";

import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
import { notifyAlert } from "../../../utils/notificationService";
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
  
  // State for status popup
  const [statusPopupOpen, setStatusPopupOpen] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const itemsPerPage = 5;
  const statusOptions = ["PENDING","IN_PROGRESS", "CONFIRMED", "CANCELLED"];

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
    if (!id) {
      notifyAlert({
        title: "Error",
        message: "Invalid flight ID",
        type: "error",
      });
      return;
    }
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) {
      notifyAlert({
        title: "Error",
        message: "No flight selected for deletion",
        type: "error",
      });
      setConfirmOpen(false);
      return;
    }

    try {
      const result = await dispatch(deleteFlight(deleteId)).unwrap();
      notifyAlert({
        title: "Success",
        message: result?.message || "Flight booking deleted successfully",
        type: "success",
      });
    } catch (error) {
      notifyAlert({
        title: "Error",
        message: error?.message || error || "Failed to delete flight booking",
        type: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (flight, newStatus) => {
    if (!flight?._id) {
      notifyAlert({
        title: "Error",
        message: "Invalid flight data - missing ID",
        type: "error",
      });
      return;
    }

    try {
      setUpdatingStatusId(flight._id);
      
      const updateData = {
        ...flight,
        enquiryStatus: newStatus
      };
      
      const result = await dispatch(updateFlight({ 
        id: flight._id, 
        data: updateData 
      })).unwrap();
      
      setStatusPopupOpen(null);
      
      notifyAlert({
        title: "Success",
        message: result?.message || "Status updated successfully",
        type: "success",
      });
      
    } catch (error) {
      notifyAlert({
        title: "Error",
        message: error?.message || error || "Failed to update status",
        type: "error",
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Open popup and calculate position
  const openStatusPopup = (event, flightId) => {
    event.stopPropagation();
    event.preventDefault();
    
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const popupHeight = 160;
    const popupWidth = 160;
    
    let top = buttonRect.bottom + window.scrollY + 5;
    let left = buttonRect.left + window.scrollX - popupWidth + buttonRect.width;
    
    if (left < 0) {
      left = 10;
    }
    
    if (top + popupHeight > window.innerHeight + window.scrollY) {
      top = buttonRect.top + window.scrollY - popupHeight - 5;
    }
    
    setPopupPosition({ top, left });
    setStatusPopupOpen(flightId);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-popup') && !event.target.closest('.status-button')) {
        setStatusPopupOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get status color based on status type
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
        case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
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
                    key={flight._id || index}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-6 px-8 py-5 items-center text-sm border-b border-gray-100"
                  >
                    <div className="font-medium">{flight.name}</div>
                    <div>{flight.from}</div>
                    <div>{flight.to}</div>
                    <div>
                      {flight.departureDate ? new Date(flight.departureDate).toLocaleDateString() : 'N/A'}
                    </div>

                    {/* Status Column with Pencil Button */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(flight.enquiryStatus)}`}>
                          {flight.enquiryStatus || "PENDING"}
                        </span>
                        
                        {/* Pencil Button that opens popup */}
                        <button
                          onClick={(e) => openStatusPopup(e, flight._id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors status-button"
                          disabled={updatingStatusId === flight._id}
                        >
                          <PencilLine className={`w-4 h-4 ${updatingStatusId === flight._id ? 'text-gray-300' : 'text-gray-600'}`} />
                        </button>
                      </div>
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
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button className="w-10 h-10 rounded-lg bg-green-800 text-white">
                    {currentPage}
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Status Popup */}
      {statusPopupOpen && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 w-40 status-popup"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <div className="py-1">
            {statusOptions.map((status) => {
              const flight = currentFlights.find(f => f._id === statusPopupOpen);
              return (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${flight?.enquiryStatus === status ? 'bg-gray-50 font-medium' : ''}
                    ${updatingStatusId ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    const flight = currentFlights.find(f => f._id === statusPopupOpen);
                    if (flight) {
                      handleStatusUpdate(flight, status);
                    }
                  }}
                  disabled={updatingStatusId === statusPopupOpen}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'PENDING' ? 'bg-yellow-500' :
                      status === 'CONFIRMED' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></span>
                    {status}
                    {updatingStatusId === statusPopupOpen && (
                      <span className="ml-auto">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this flight booking?"
        message="This action cannot be undone."
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