"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearHotelError,
  clearHotelMessage,
  deleteHotel,
  getHotels,
  updateHotel,
} from "../../../store/slice/HotelSlice";

import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
import { notifyAlert } from "../../../utils/notificationService";
import CreateHotel from "./CreateHotel";

const HotelBookingSection = () => {
  const dispatch = useDispatch();

  const {
    hotels = [],
    actionLoading,
    deletedMessage,
    deletedError,
  } = useSelector((state) => state.hotels);

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // State for status popup
  const [statusPopupOpen, setStatusPopupOpen] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const itemsPerPage = 5;
  const statusOptions = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  useEffect(() => {
    dispatch(getHotels());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Delete Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearHotelMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearHotelError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const filteredHotels = hotels.filter((item) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();

    return (
      item.name?.toLowerCase().includes(s) ||
      item.email?.toLowerCase().includes(s) ||
      item.phoneNo?.includes(s) ||
      item.destination?.toLowerCase().includes(s) ||
      item.roomType?.toLowerCase().includes(s) ||
      item.enquiryStatus?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id) => {
    if (!id) {
      notifyAlert({
        title: "Error",
        message: "Invalid hotel ID",
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
        message: "No hotel selected for deletion",
        type: "error",
      });
      setConfirmOpen(false);
      return;
    }

    try {
      const result = await dispatch(deleteHotel(deleteId)).unwrap();
      notifyAlert({
        title: "Success",
        message: result?.message || "Hotel booking deleted successfully",
        type: "success",
      });
    } catch (error) {
      notifyAlert({
        title: "Error",
        message: error?.message || error || "Failed to delete hotel booking",
        type: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (hotel, newStatus) => {
    if (!hotel?._id) {
      notifyAlert({
        title: "Error",
        message: "Invalid hotel data - missing ID",
        type: "error",
      });
      return;
    }

    try {
      setUpdatingStatusId(hotel._id);
      
      const updateData = {
        ...hotel,
        enquiryStatus: newStatus
      };
      
      const result = await dispatch(updateHotel({ 
        id: hotel._id, 
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
  const openStatusPopup = (event, hotelId) => {
    event.stopPropagation();
    event.preventDefault();
    
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const popupHeight = 200;
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
    setStatusPopupOpen(hotelId);
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <>
      {openModal ? (
        <CreateHotel
          hotelData={selectedHotel}
          onClose={() => {
            setOpenModal(false);
            setSelectedHotel(null);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Hotel Booking List ({filteredHotels.length})
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search hotel bookings..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border px-4 py-2 rounded-md text-sm w-64 border-gray-300"
                />

                <button
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedHotel(null);
                  }}
                  className="bg-green-800 text-white px-6 py-2 rounded-md"
                >
                  + Create Hotel
                </button>
              </div>
            </div>

            <motion.div className="bg-white rounded shadow overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Destination</div>
                <div>Room Type</div>
                <div>Check In</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Rows */}
              {currentHotels.map((hotel, index) => (
                <motion.div
                  key={hotel._id || index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm border-b border-gray-100"
                >
                  <div className="font-medium">{hotel.name}</div>
                  <div>{hotel.destination}</div>
                  <div>{hotel.roomType}</div>
                  <div>
                    {hotel.checkInDate ? new Date(hotel.checkInDate).toLocaleDateString() : 'N/A'}
                  </div>
                  
                  {/* Status Column with Pencil Button */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-xl ${getStatusColor(hotel.enquiryStatus)}`}>
                        {hotel.enquiryStatus || "PENDING"}
                      </span>
                      
                      {/* Pencil Button that opens popup */}
                      <button
                        onClick={(e) => openStatusPopup(e, hotel._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors status-button"
                        disabled={updatingStatusId === hotel._id}
                      >
                        <PencilLine className={`w-4 h-4 ${updatingStatusId === hotel._id ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="flex justify-end">
                    <DotMenu
                      onEdit={() => {
                        setSelectedHotel(hotel);
                        setOpenModal(true);
                      }}
                      onDelete={() => handleDeleteClick(hotel._id)}
                    />
                  </div>
                </motion.div>
              ))}

              {currentHotels.length === 0 && (
                <div className="px-8 py-10 text-center text-gray-500">
                  No hotel bookings found
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-8 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredHotels.length)}{" "}
                    of {filteredHotels.length}
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
              )}
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
              const hotel = currentHotels.find(h => h._id === statusPopupOpen);
              return (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${hotel?.enquiryStatus === status ? 'bg-gray-50 font-medium' : ''}
                    ${updatingStatusId ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    const hotel = currentHotels.find(h => h._id === statusPopupOpen);
                    if (hotel) {
                      handleStatusUpdate(hotel, status);
                    }
                  }}
                  disabled={updatingStatusId === statusPopupOpen}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'PENDING' ? 'bg-yellow-500' :
                      status === 'CONFIRMED' ? 'bg-green-500' :
                      status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-blue-500'
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
        title="Delete this hotel booking?"
        message="Are you sure you want to delete this hotel booking? This action cannot be undone."
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

export default HotelBookingSection;