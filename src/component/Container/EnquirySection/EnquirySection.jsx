import { motion } from "framer-motion";
import { BiChevronDown } from "react-icons/bi";
import { useEffect, useState } from "react";
import { statusColor } from "../../../utils/customColorCreate";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEnquiryError,
  clearEnquiryMessage,
  deleteEnquiry,
  getEnquiries,
} from "../../../store/slice/enquirySlice";
import CreateEnquiry from "./CreateEnquiry";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

import Pagination from "../../../common/Pagination";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";

const ITEMS_PER_PAGE = 8;

const EnquirySection = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const { enquiries, deletedMessage, deletedError, actionLoading } =
    useSelector((state) => state.enquiry);

  useEffect(() => {
    dispatch(getEnquiries());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEnquiries = enquiries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteEnquiry({ deleteId }));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Delete Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearEnquiryMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearEnquiryError());
    }
  }, [deletedMessage, deletedError, dispatch]);
  return (
    <>
      {openModal ? (
        <CreateEnquiry
          enquiryData={selectedEnquiry}
          onClose={() => {
            setOpenModal(false);
          }}
        />
      ) : (
        <div className="min-h-screen px-6 py-10 ">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="overflow-x-auto">
                <div className="flex items-center gap-6 text-sm font-medium whitespace-nowrap min-w-max">
                  {[
                    "All Guest",
                    "Pending",
                    "Booked",
                    "Canceled",
                    "Refund",
                  ]?.map((tab, idx) => (
                    <button
                      key={tab}
                      className={`pb-3 transition-all ${
                        idx === 0
                          ? "border-b-2 border-[#14532D] text-[#14532D]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  onClick={() => setOpenModal(true)}
                  className="px-6 py-3 bg-[#14532D]  text-white rounded-xl hover:bg-green-800 cursor-pointer"
                >
                  Create Enquiry
                </button>
                <div className="bg-[#14532D] text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800">
                  02/13/2026
                </div>
                <div className="relative inline-block">
                  <div
                    onClick={() => setOpen(!open)}
                    className="bg-white border border-gray-200 px-7  py-3 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {sort}
                    <BiChevronDown size={18} className="text-gray-400" />
                  </div>
                  {open && (
                    <div className="absolute top-full mt-2 w-32 bg-gray-100 rounded-lg shadow-md py-2 z-50">
                      <div
                        onClick={() => {
                          setSort("Oldest");
                          setOpen(false);
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        Oldest
                      </div>

                      <div
                        onClick={() => {
                          setSort("Newest");
                          setOpen(false);
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        Newest
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded shadow mt-8"
            >
              <div>
                <div>
                  <div className="grid grid-cols-12 px-8 py-4 text-md font-bold text-black border-b border-gray-300">
                    <div className="col-span-2">Name</div>
                    <div className="col-span-2">Email</div>
                    <div className="col-span-2">Create At</div>
                    <div className="col-span-2">Special Request</div>
                    <div className="col-span-1">Package</div>
                    <div className="col-span-1">days & nights</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {paginatedEnquiries?.map((guest, index) => (
                    <motion.div
                      key={guest._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 px-8 py-5 text-sm items-center"
                    >
                      <div className="col-span-2">
                        <div className="font-semibold text-slate-800">
                          {guest.name}
                        </div>
                        <div className="text-xs text-red-500 mt-1">
                          {guest.phone}
                        </div>
                      </div>

                      <div title={guest.email} className="col-span-2 truncate">
                        {guest.email}
                      </div>

                      <div className="col-span-2 text-slate-800 ">
                        {formatIndianDateTime(guest.createdAt)}
                      </div>
                      <div className="col-span-2">
                        <button
                          title={guest?.specialRequest}
                          className=" text-slate-800 px-5 py-2 rounded-xl text-sm font-medium line-clamp-2"
                        >
                          {guest.specialRequest}
                        </button>
                      </div>
                      <div className="col-span-1 text-slate-800 font-medium">
                        {guest?.packageId?.packageName}
                      </div>
                      <div className="col-span-1 text-slate-800 font-medium">
                        {guest?.packageId?.days}/{guest?.packageId?.nights}
                      </div>
                      <div className="col-span-1">
                        <span
                          className={`inline-flex justify-center min-w-[95px] px-4 mx-6 py-2 rounded-xl text-xs font-semibold ${statusColor(
                            guest.enquiryStatus,
                          )}`}
                        >
                          {guest.enquiryStatus}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end relative group">
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6h.01M12 12h.01M12 18h.01"
                            />
                          </svg>
                        </button>
                        <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(guest);
                              setOpenModal(true);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(guest?._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Pagination
                    currentPage={currentPage}
                    totalItems={enquiries.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this enquiry?"
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

export default EnquirySection;
