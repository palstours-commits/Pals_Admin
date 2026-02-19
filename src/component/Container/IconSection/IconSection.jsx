import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearIconError,
  clearIconMessage,
  deleteIcon,
  getIcons,
} from "../../../store/slice/iconSlice";
import { formatIndianDateTime } from "../../../utils/formatDateTime";
import Image from "../../../common/Image";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import DotMenu from "../../../common/DotMenu";
import CreateIcon from "./CreateIcon";

const IconSection = () => {
  const dispatch = useDispatch();
  const { icons, actionLoading, deletedMessage, deletedError } = useSelector(
    (state) => state.icon,
  );

  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const totalPages = Math.ceil(icons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIcons = icons?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    dispatch(getIcons());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteIcon(deleteId));
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
      dispatch(clearIconMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearIconError());
    }
  }, [deletedMessage, deletedError]);

  return (
    <>
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Icon List ({icons?.length})</h2>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-800 text-white px-6 py-2 rounded-md"
            >
              + Create Icon
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded shadow overflow-x-auto"
          >
            <div className="grid grid-cols-5 px-7 py-4 font-bold border-b border-gray-300">
              <div>Name</div>
              <div>Created</div>
              <div>Icon</div>
              <div className="text-right">Action</div>
            </div>

            {currentIcons?.map((icon, index) => (
              <motion.div
                key={icon?._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-5 px-8 py-5 items-center text-sm"
              >
                <div className="font-medium">{icon?.name}</div>
                <div>{formatIndianDateTime(icon?.createdAt)}</div>
                <div>
                  <Image
                    src={icon?.iconPath}
                    alt={icon?.name}
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex justify-end">
                  <DotMenu
                    onEdit={() => {
                      setOpenModal(true);
                      setSelectedIcon(icon);
                    }}
                    onDelete={() => handleDeleteClick(icon._id)}
                  />
                </div>
              </motion.div>
            ))}
            <div className="flex justify-between items-center px-8 py-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, icons.length)} of{" "}
                {icons.length}
              </p>

              <div className="flex gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-10 h-10 border rounded-lg flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>

                <button className="w-10 h-10 bg-green-800 text-white rounded-lg">
                  {currentPage}
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-10 h-10 border rounded-lg flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {openModal && (
        <CreateIcon
          icon={selectedIcon}
          onClose={() => {
            setOpenModal(false);
            setSelectedIcon(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this icon?"
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

export default IconSection;
