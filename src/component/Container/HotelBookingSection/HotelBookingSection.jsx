"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getHotels,
  deleteHotel,
  clearHotelError,
  clearHotelMessage,
} from "../../../store/slice/HotelSlice";

import { notifyAlert } from "../../../utils/notificationService";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
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

  const itemsPerPage = 5;

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
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteHotel(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
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
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Destination</div>
                <div>Room Type</div>
                <div>Check In</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {currentHotels.map((hotel, index) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm"
                >
                  <div className="font-medium">{hotel.name}</div>
                  <div>{hotel.destination}</div>
                  <div>{hotel.roomType}</div>
                  <div>{new Date(hotel.checkInDate).toLocaleDateString()}</div>
                  <div>
                    <span className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700">
                      {hotel.enquiryStatus || "PENDING"}
                    </span>
                  </div>
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
            </motion.div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Delete this hotel booking?"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default HotelBookingSection;
