import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getZones,
  deleteZone,
  restoreZone,
  clearZoneError,
  clearZoneMessage,
  clearDeletedZoneMessage,
} from "../../../store/slice/zoneSlice";
import { useEffect, useState } from "react";
import Image from "../../../common/Image";
import { formatIndianDateTime } from "../../../utils/formatDateTime";
import CreateZone from "./CreateZone";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import DotMenu from "../../../common/DotMenu";

const Zonesection = () => {
  const dispatch = useDispatch();
  const { zones, actionLoading, error, message, deletedMessage } = useSelector(
    (state) => state.zone,
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredZone = zones?.filter((menu) =>
    menu?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Success",
        message,
        type: "success",
      });
      dispatch(clearZoneMessage());
    }

    if (error) {
      notifyAlert({
        title: "Error",
        message,
        type: "error",
      });
      dispatch(clearZoneError());
    }

    if (deletedMessage) {
      notifyAlert({
        title: "Deleted",
        message: deletedMessage,
        type: "success",
      });
      dispatch(clearDeletedZoneMessage());
    }
  }, [message, error, deletedMessage]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteZone(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="flex justify-between items-center mb-6 px-8">
          <h2 className="text-xl font-bold">Zone List ({zones?.length})</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name or status..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm w-64 focus:outline-none "
            />
            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              + Create Zone
            </button>
          </div>
        </div>
        {filteredZone?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredZone.map((zone) => (
              <div
                key={zone._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="relative h-60 w-full">
                  <Image
                    src={zone.image}
                    alt={zone.name}
                    className="h-full w-full object-cover transform transition duration-600 hover:scale-105 cursor-pointer"
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-red-600">
                      {zone.subMenuId?.name || "SubMenu"}
                    </span>

                    <DotMenu
                      onEdit={() => {
                        setSelectedZone(zone);
                        setOpenModal(true);
                      }}
                      onDelete={() => handleDeleteClick(zone._id)}
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {zone.name}
                  </h2>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {zone.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatIndianDateTime(zone.createdAt)}</span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        zone.deletedAt
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {zone.deletedAt ? "Deleted" : "Active"}
                    </span>
                  </div>

                  {zone.deletedAt && (
                    <button
                      onClick={() => dispatch(restoreZone(zone._id))}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                    >
                      Restore Zone
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
            <h3 className="text-lg font-semibold">No Zones Found</h3>
            <p className="text-sm mt-1 text-center">
              {searchTerm
                ? "No zones match your search."
                : "Zones will appear here once created."}
            </p>
          </div>
        )}
      </div>
      {openModal && (
        <CreateZone
          zone={selectedZone}
          onClose={() => {
            setOpenModal(false);
            setSelectedZone(null);
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this zone?"
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

export default Zonesection;
