"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getTransports,
  deleteTransport,
  clearTransportError,
  clearTransportMessage,
} from "../../../store/slice/transportSlice";

import { notifyAlert } from "../../../utils/notificationService";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
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

  const itemsPerPage = 5;

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransports = filteredTransports.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteTransport(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
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
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Rental Type</div>
                <div>Car Type</div>
                <div>Start Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {currentTransports.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm"
                >
                  <div className="font-medium">{item.name}</div>
                  <div>{item.rentalType}</div>
                  <div>{item.carType}</div>
                  <div>{new Date(item.startDate).toLocaleDateString()}</div>
                  <div>
                    <span className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700">
                      {item.enquiryStatus || "PENDING"}
                    </span>
                  </div>
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
            </motion.div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Delete this transport booking?"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default TransportBookingSection;
