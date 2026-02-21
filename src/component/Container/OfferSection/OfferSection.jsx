"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOffers,
  deleteOffer,
  clearOfferError,
  clearOfferMessage,
} from "../../../store/slice/offerSlice";
import CreateOffer from "./CreateOffer";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import DotMenu from "../../../common/DotMenu";

const OfferSection = () => {
  const dispatch = useDispatch();
  const { offers, loading, deletedMessage, error } = useSelector(
    (state) => state.offer,
  );

  const [openForm, setOpenForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({
        title: "Success",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearOfferMessage());
    }
    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearOfferError());
    }
  }, [deletedMessage, error, dispatch]);

  const handleDelete = async () => {
    await dispatch(deleteOffer(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  if (openForm) {
    return (
      <CreateOffer
        offerData={selectedOffer}
        onClose={() => {
          setOpenForm(false);
          setSelectedOffer(null);
        }}
      />
    );
  }

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Offers ({offers?.length || 0})</h2>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
        >
          + Create Offer
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {offers?.map((offer) => (
          <div
            key={offer._id}
            className="relative bg-white   p-6 shadow hover:shadow-md"
          >
            <div className="absolute top-3 right-3 z-10">
              <DotMenu
                onEdit={() => {
                  setSelectedOffer(offer);
                  setOpenForm(true);
                }}
                onDelete={() => {
                  setDeleteId(offer._id);
                  setConfirmOpen(true);
                }}
              />
            </div>
            <h3 className="text-md font-bold mb-2 pr-6">
              {offer.offerPercentage}% Off – {offer.offerName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {offer.description}
            </p>
            <div className="flex flex-col justify-between  text-xs gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-32">
                {offer.offerCategory}
              </span>
              <span className="text-gray-500">
                Valid till {new Date(offer.validTo).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this offer?"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default OfferSection;
