import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Image from "../../../common/Image";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import DotMenu from "../../../common/DotMenu";
import CreateSubMenu from "./CreateSubMenu";
import {
  clearSubMenuError,
  clearSubMenuMessage,
  deleteSubMenu,
  getSubMenus,
} from "../../../store/slice/submenuSlice";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

const SubMenuSection = () => {
  const dispatch = useDispatch();
  const { submenus, actionLoading, deletedError, deletedMessage } = useSelector(
    (state) => state.submenu,
  );
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const totalPages = Math.ceil(submenus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = submenus?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    dispatch(getSubMenus());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    await dispatch(deleteSubMenu(deleteId));
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
      dispatch(clearSubMenuMessage());
    }

    if (deletedError) {
      notifyAlert({
        title: "Delete Failed",
        message: deletedError,
        type: "error",
      });
      dispatch(clearSubMenuError());
    }
  }, [deletedMessage, deletedError]);

  return (
    <>
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              SubMenu List ({submenus?.length}){" "}
            </h2>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              + Create SubMenu
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded shadow overflow-x-auto overflow-y-visible"
          >
            <div>
              <div className="grid grid-cols-5  px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Created</div>
                <div>Images</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              {currentServices?.map((menu, index) => (
                <motion.div
                  key={menu?._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-5 px-8 py-5 items-center text-sm"
                >
                  <div className="font-medium">{menu?.name}</div>
                  <div>{formatIndianDateTime(menu?.createdAt)}</div>
                  <div>
                    <Image
                      src={menu?.bannerImage}
                      alt={menu?.name}
                      className="w-15 h-15"
                    />
                  </div>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        menu?.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {menu?.status}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <DotMenu
                      onEdit={() => {
                        setOpenModal(true);
                        setSelectedService(menu);
                      }}
                      onDelete={() => handleDeleteClick(menu._id)}
                    />
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-between items-center px-8 py-4 ">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, submenus.length)} of{" "}
                  {submenus.length}
                </p>

                <div className="flex gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    className={`w-10 h-10 rounded-lg ${
                      currentPage ? "bg-green-800 text-white" : "border"
                    }`}
                  >
                    {currentPage}
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {openModal && (
        <CreateSubMenu
          service={selectedService}
          onClose={() => {
            setOpenModal(false);
            setSelectedService(null);
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this menu?"
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

export default SubMenuSection;
