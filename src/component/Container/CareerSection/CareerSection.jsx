"use client";

import { Calendar, Briefcase } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCareers,
  deleteCareer,
  updateCareerStatus,
  clearCareerError,
  clearCareerMessage,
} from "../../../store/slice/careerSlice";
import { useEffect, useState } from "react";
import { formatIndianDateTime } from "../../../utils/formatDateTime";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import DotMenu from "../../../common/DotMenu";
import CreateCareer from "./CreateCareer";

const CareerSection = () => {
  const dispatch = useDispatch();
  const { careers, actionLoading, error, message, deletedMessage } =
    useSelector((state) => state.career);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCareers = careers?.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getCareers());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearCareerMessage());
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearCareerError());
    }

    if (deletedMessage) {
      notifyAlert({
        title: "Deleted",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearCareerMessage());
    }
  }, [message, error, deletedMessage]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteCareer(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="flex justify-between items-center mb-6 px-8">
          <h2 className="text-xl font-bold">
            Career Applications ({careers?.length})
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded-md text-sm w-64"
            />
          </div>
        </div>

        {filteredCareers?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCareers?.map((career) => (
              <div
                key={career._id}
                className="bg-white rounded-xl shadow-lg border"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-green-700">
                      {career.status}
                    </span>

                    <DotMenu
                      onEdit={() => {
                        setSelectedCareer(career);
                        setOpenModal(true);
                      }}
                      onDelete={() => handleDeleteClick(career._id)}
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {career.name}
                  </h2>

                  <p className="text-sm text-gray-600">{career.email}</p>
                  <p className="text-sm text-gray-600">{career.phone}</p>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatIndianDateTime(career.createdAt)}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {["pending", "contacted", "closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          dispatch(
                            updateCareerStatus({
                              id: career._id,
                              data: { status },
                            }),
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          career.status === status
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
            <Briefcase className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold">
              No Career Applications Found
            </h3>
            <p className="text-sm mt-1">
              {searchTerm
                ? "No results match your search."
                : "Career applications will appear here once submitted."}
            </p>
          </div>
        )}
      </div>
      {openModal && (
        <CreateCareer
          career={selectedCareer}
          onClose={() => {
            setOpenModal(false);
            setSelectedCareer(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this application?"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default CareerSection;
