"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getVisas,
  deleteVisa,
  clearVisaError,
  clearVisaMessage,
} from "../../../store/slice/visasSlice";

import { notifyAlert } from "../../../utils/notificationService";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import DotMenu from "../../../common/DotMenu";
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

  const itemsPerPage = 5;

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
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteVisa(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
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
              <div className="grid grid-cols-6 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Visa Type</div>
                <div>Country</div>
                <div>Travel Date</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {currentVisas.map((visa, index) => (
                <motion.div
                  key={visa._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm"
                >
                  <div className="font-medium">
                    {visa.firstName} {visa.lastName}
                  </div>
                  <div>{visa.visaType}</div>
                  <div>{visa.countryToVisit}</div>
                  <div>
                    {new Date(visa.travelStartDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700">
                      {visa.enquiryStatus || "PENDING"}
                    </span>
                  </div>
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
            </motion.div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Delete this visa enquiry?"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default VisaBookingSection;
