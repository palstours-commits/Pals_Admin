"use client";
import { motion } from "framer-motion";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearTransportError,
  clearTransportMessage,
  deleteTransport,
  getTransports,
  updateTransport,
} from "../../../store/slice/transportSlice";

import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
import { notifyAlert } from "../../../utils/notificationService";
import CreateTransport from "./CreateTransport";

const TransportBookingSection = () => {
  const dispatch = useDispatch();

  const {
    transports = [],
    actionLoading,
    deletedMessage,
    deletedError,
  } = useSelector((state) => state.transports);

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // State for status popup
  const [statusPopupOpen, setStatusPopupOpen] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const itemsPerPage = 5;
  const statusOptions = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  useEffect(() => {
    dispatch(getTransports());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Delete Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearTransportMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearTransportError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const filteredTransports = transports.filter((item) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();

    return (
      item.name?.toLowerCase().includes(s) ||
      item.email?.toLowerCase().includes(s) ||
      item.phoneNo?.includes(s) ||
      item.rentalType?.toLowerCase().includes(s) ||
      item.carType?.toLowerCase().includes(s) ||
      item.location?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredTransports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransports = filteredTransports.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id) => {
    if (!id) {
      notifyAlert({
        title: "Error",
        message: "Invalid transport ID",
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
        message: "No transport selected for deletion",
        type: "error",
      });
      setConfirmOpen(false);
      return;
    }

    try {
      const result = await dispatch(deleteTransport(deleteId)).unwrap();
      notifyAlert({
        title: "Success",
        message: result?.message || "Transport booking deleted successfully",
        type: "success",
      });
    } catch (error) {
      notifyAlert({
        title: "Error",
        message: error?.message || error || "Failed to delete transport booking",
        type: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (transport, newStatus) => {
    if (!transport?._id) {
      notifyAlert({
        title: "Error",
        message: "Invalid transport data - missing ID",
        type: "error",
      });
      return;
    }

    try {
      setUpdatingStatusId(transport._id);
      
      const updateData = {
        ...transport,
        enquiryStatus: newStatus
      };
      
      const result = await dispatch(updateTransport({ 
        id: transport._id, 
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
  const openStatusPopup = (event, transportId) => {
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
    setStatusPopupOpen(transportId);
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
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'RESOLVED':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <>
      {openModal ? (
        <CreateTransport
          transportData={selectedTransport}
          onClose={() => {
            setOpenModal(false);
            setSelectedTransport(null);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Transport Booking List ({filteredTransports.length})
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search transport bookings..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border px-4 py-2 rounded-md text-sm w-64 border-gray-300 outline-0"
                />

                <button
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedTransport(null);
                  }}
                  className="bg-green-800 text-white px-6 py-2 rounded-md"
                >
                  + Create Transport
                </button>
              </div>
            </div>

            <motion.div className="bg-white rounded shadow overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Rental Type</div>
                <div>Car Type</div>
                <div>Start Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Rows */}
              {currentTransports.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm border-b border-gray-100"
                >
                  <div className="font-medium">{item.name}</div>
                  <div>{item.rentalType}</div>
                  <div>{item.carType}</div>
                  <div>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</div>
                  
                  {/* Status Column with Pencil Button */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-xl ${getStatusColor(item.enquiryStatus)}`}>
                        {item.enquiryStatus || "PENDING"}
                      </span>
                      
                      {/* Pencil Button that opens popup */}
                      <button
                        onClick={(e) => openStatusPopup(e, item._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors status-button"
                        disabled={updatingStatusId === item._id}
                      >
                        <PencilLine className={`w-4 h-4 ${updatingStatusId === item._id ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="flex justify-end">
                    <DotMenu
                      onEdit={() => {
                        setSelectedTransport(item);
                        setOpenModal(true);
                      }}
                      onDelete={() => handleDeleteClick(item._id)}
                    />
                  </div>
                </motion.div>
              ))}

              {currentTransports.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No transport bookings found
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
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
              const transport = currentTransports.find(t => t._id === statusPopupOpen);
              return (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${transport?.enquiryStatus === status ? 'bg-gray-50 font-medium' : ''}
                    ${updatingStatusId ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    const transport = currentTransports.find(t => t._id === statusPopupOpen);
                    if (transport) {
                      handleStatusUpdate(transport, status);
                    }
                  }}
                  disabled={updatingStatusId === statusPopupOpen}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'PENDING' ? 'bg-yellow-500' :
                      status === 'IN_PROGRESS' ? 'bg-blue-500' :
                      status === 'RESOLVED' ? 'bg-green-500' :
                      'bg-gray-500'
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
        title="Delete this transport booking?"
        message="Are you sure you want to delete this transport booking? This action cannot be undone."
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

export default TransportBookingSection;