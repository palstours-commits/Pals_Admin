"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

import {
  getContacts,
  deleteContact,
  clearContactError,
  clearContactMessage,
} from "../../../store/slice/contactusSlice";
import CreateContact from "./CreateContact";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RESOLVED: "bg-blue-100 text-blue-700",
};

const ContactSection = () => {
  const dispatch = useDispatch();

  const { contacts, loading, deletedMessage, deletedError } = useSelector(
    (state) => state.contactus
  );

  const messageList = Array.isArray(contacts)
    ? contacts
    : contacts?.messages ?? [];

  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectData, setSelectData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = messageList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(search) ||
      item.lastName?.toLowerCase().includes(search) ||
      item.email?.toLowerCase().includes(search) ||
      item.mobile?.toString().includes(search) ||
      item.accommodationType?.toLowerCase().includes(search) ||
      item.contactUsStatus?.toLowerCase().includes(search) ||
      item.message?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({ title: "Success", message: deletedMessage, type: "success" });
      dispatch(clearContactMessage());
    }
    if (deletedError) {
      notifyAlert({ title: "Error", message: deletedError, type: "error" });
      dispatch(clearContactError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const handleDelete = async () => {
    await dispatch(deleteContact(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      {openModal ? (
        <CreateContact
          contactData={selectData}
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
                Contact Messages ({messageList.length})
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by name, status, accommodation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded-md text-sm w-72 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSelectData(null);
                    setOpenModal(true);
                  }}
                  className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer whitespace-nowrap"
                >
                  + Create Contact
                </button>
              </div>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              <div className="grid grid-cols-9 px-7 py-4 font-bold border-b border-gray-300 text-sm min-w-[1100px]">
                <div>Name</div>
                <div>Email</div>
                <div>Mobile</div>
                <div>Arrival Date</div>
                <div>Nights</div>
                <div>Accommodation</div>
                <div>Status</div>
                <div>Created</div>
                <div className="text-right">Action</div>
              </div>

              {filteredContacts.length > 0 ? (
                filteredContacts.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-9 px-7 py-4 text-sm items-center border-b border-gray-100 hover:bg-gray-50 transition min-w-[1100px]"
                  >
                    <div className="font-medium">
                      {item.firstName} {item.lastName}
                    </div>
                    <div className="truncate pr-2" title={item.email}>
                      {item.email}
                    </div>
                    <div>{item.mobile}</div>
                    <div className="text-gray-600">
                      {item.tentativeArrivalDate
                        ? new Date(item.tentativeArrivalDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "—"}
                    </div>
                    <div className="text-center">{item.numberOfNights ?? "—"}</div>
                    <div className="truncate pr-2 text-gray-700" title={item.accommodationType}>
                      {item.accommodationType ?? "—"}
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[item.contactUsStatus] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.contactUsStatus ?? "—"}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      {formatIndianDateTime(item.createdAt)}
                    </div>
                    <div className="flex justify-end">
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-10 text-center text-gray-500 min-w-[1100px]">
                  No contact messages found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this contact?"
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

export default ContactSection;