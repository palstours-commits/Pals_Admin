"use client";
import { motion } from "framer-motion";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearVisaError,
  clearVisaMessage,
  deleteVisa,
  getVisas,
  updateVisa,
} from "../../../store/slice/visasSlice";

import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
import { notifyAlert } from "../../../utils/notificationService";
import CreateVisa from "./CreateVisa";

const VisaBookingSection = () => {
  const dispatch = useDispatch();

  const {
    visas = [],
    actionLoading,
    deletedMessage,
    deletedError,
  } = useSelector((state) => state.visas);

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);
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
    dispatch(getVisas());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Delete Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearVisaMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearVisaError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const filteredVisas = visas.filter((item) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();

    return (
      item.firstName?.toLowerCase().includes(s) ||
      item.lastName?.toLowerCase().includes(s) ||
      item.email?.toLowerCase().includes(s) ||
      item.phoneNo?.includes(s) ||
      item.visaType?.toLowerCase().includes(s) ||
      item.countryToVisit?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredVisas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVisas = filteredVisas.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id) => {
    if (!id) {
      notifyAlert({
        title: "Error",
        message: "Invalid visa ID",
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
        message: "No visa selected for deletion",
        type: "error",
      });
      setConfirmOpen(false);
      return;
    }

    try {
      const result = await dispatch(deleteVisa(deleteId)).unwrap();
      notifyAlert({
        title: "Success",
        message: result?.message || "Visa deleted successfully",
        type: "success",
      });
    } catch (error) {
      notifyAlert({
        title: "Error",
        message: error?.message || error || "Failed to delete visa",
        type: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (visa, newStatus) => {
    if (!visa?._id) {
      notifyAlert({
        title: "Error",
        message: "Invalid visa data - missing ID",
        type: "error",
      });
      return;
    }

    try {
      setUpdatingStatusId(visa._id);
      
      const updateData = {
        enquiryStatus: newStatus,
        firstName: visa.firstName,
        lastName: visa.lastName,
        email: visa.email,
        phoneNo: visa.phoneNo,
        visaType: visa.visaType,
        countryToVisit: visa.countryToVisit,
        travelStartDate: visa.travelStartDate,
        travelEndDate: visa.travelEndDate,
      };
      
      const result = await dispatch(updateVisa({ 
        id: visa._id, 
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
  const openStatusPopup = (event, visaId) => {
    event.stopPropagation();
    event.preventDefault();
    
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const popupHeight = 200; // Approximate height of popup
    const popupWidth = 160; // Width of popup
    
    let top = buttonRect.bottom + window.scrollY + 5;
    let left = buttonRect.left + window.scrollX - popupWidth + buttonRect.width;
    
    // Check if popup would go off screen
    if (left < 0) {
      left = 10;
    }
    
    // Check if popup would go below viewport
    if (top + popupHeight > window.innerHeight + window.scrollY) {
      top = buttonRect.top + window.scrollY - popupHeight - 5;
    }
    
    setPopupPosition({ top, left });
    setStatusPopupOpen(visaId);
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
        return 'bg-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-300';
      case 'RESOLVED':
        return 'bg-green-300';
      case 'CLOSED':
        return 'bg-gray-300';
      default:
        return 'bg-yellow-300';
    }
  };

  return (
    <>
      {openModal ? (
        <CreateVisa
          visaData={selectedVisa}
          onClose={() => {
            setOpenModal(false);
            setSelectedVisa(null);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Visa Enquiry List ({filteredVisas.length})
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search visa enquiries..."
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
                    setSelectedVisa(null);
                  }}
                  className="bg-green-800 text-white px-6 py-2 rounded-md"
                >
                  + Create Visa
                </button>
              </div>
            </div>

            <motion.div className="bg-white rounded shadow overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Visa Type</div>
                <div>Country</div>
                <div>Travel Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Rows */}
              {currentVisas.map((visa, index) => (
                <motion.div
                  key={visa._id || index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm border-b border-gray-100"
                >
                  <div className="font-medium">
                    {visa.firstName} {visa.lastName}
                  </div>
                  <div>{visa.visaType}</div>
                  <div>{visa.countryToVisit}</div>
                  <div>
                    {visa.travelStartDate ? new Date(visa.travelStartDate).toLocaleDateString() : 'N/A'}
                  </div>
                  
                  {/* Status Column with Pencil Button */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-xl text-black ${getStatusColor(visa.enquiryStatus)}`}>
                        {visa.enquiryStatus || "PENDING"}
                      </span>
                      
                      {/* Pencil Button that opens popup */}
                      <button
                        onClick={(e) => openStatusPopup(e, visa._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors status-button"
                        disabled={updatingStatusId === visa._id}
                      >
                        <PencilLine className={`w-4 h-4 ${updatingStatusId === visa._id ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="flex justify-end">
                    <DotMenu
                      onEdit={() => {
                        setSelectedVisa(visa);
                        setOpenModal(true);
                      }}
                      onDelete={() => handleDeleteClick(visa._id)}
                    />
                  </div>
                </motion.div>
              ))}

              {currentVisas.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No visa enquiries found
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
              const visa = currentVisas.find(v => v._id === statusPopupOpen);
              return (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${visa?.enquiryStatus === status ? 'bg-gray-50 font-medium' : ''}
                    ${updatingStatusId ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    const visa = currentVisas.find(v => v._id === statusPopupOpen);
                    if (visa) {
                      handleStatusUpdate(visa, status);
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
        title="Delete this visa enquiry?"
        message="Are you sure you want to delete this visa enquiry? This action cannot be undone."
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

export default VisaBookingSection;