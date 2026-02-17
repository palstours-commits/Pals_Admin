"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../store/slice/formatDateTime";

import {
  getContacts,
  deleteContact,
  clearContactError,
  clearContactMessage,
} from "../../../store/slice/contactusSlice";
import CreateContact from "./CreateContact";

const ContactSection = () => {
  const dispatch = useDispatch();

  const { contacts, loading, deletedMessage, deletedError } = useSelector(
    (state) => state.contactus,
  );

  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectData, setSelectData] = useState(null);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearContactMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Error",
        message: deletedError,
        type: "error",
      });
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
                Contact Messages ({contacts?.length || 0})
              </h2>

              <button
                onClick={() => {
                  setSelectData(null);
                  setOpenModal(true);
                }}
                className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
              >
                + Create Contact
              </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              <div className="grid grid-cols-7 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Email</div>
                <div>Mobile</div>
                <div>Country</div>
                <div>message</div>
                <div>Created</div>
                <div className="text-right">Action</div>
              </div>

              {contacts?.length > 0 ? (
                contacts?.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-7 px-8 py-5 text-sm items-center "
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="truncate">{item.email}</div>
                    <div>{item.mobile}</div>
                    <div>{item.country}</div>
                    <div title={item?.message} className="line-clamp-6">
                      {item.message}
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
                <div className="px-8 py-10 text-center text-gray-500">
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
