import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "../../../common/Image";
import DotMenu from "../../../common/DotMenu";
import CreatePackage from "./CreatePackage";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../store/slice/formatDateTime";

import {
  getPackages,
  deletePackage,
  clearPackageError,
  clearPackageMessage,
} from "../../../store/slice/packageSlice";
import { Link } from "react-router-dom";

const PackageSection = () => {
  const dispatch = useDispatch();

  const { packages, loading, deletedMessage, deletedError } = useSelector(
    (state) => state.package,
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  useEffect(() => {
    if (deletedMessage) {
      notifyAlert({ title: "Success", deletedMessage, type: "success" });
      dispatch(clearPackageMessage());
    }

    if (deletedError) {
      notifyAlert({ title: "Error", message: deletedError, type: "error" });
      dispatch(clearPackageError());
    }
  }, [deletedMessage, deletedError, dispatch]);

  const handleDelete = async () => {
    await dispatch(deletePackage(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      {openModal ? (
        <CreatePackage
          packageData={selectedPackage}
          onClose={() => {
            setOpenModal(false);
            setSelectedPackage(null);
          }}
        />
      ) : (
        <div className="min-h-screen">
          <div className="flex justify-between items-center mb-6 px-8">
            <h2 className="text-xl font-bold">
              Package List ({packages?.length || 0})
            </h2>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              + Create Package
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {packages?.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden "
              >
                <Link to={`/package/${pkg?._id}`}>
                  <div className="relative h-56">
                    <Image
                      src={pkg.images?.[0]}
                      alt={pkg.packageName}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-red-600 font-semibold">
                      {pkg.zoneId?.name}
                    </span>

                    <DotMenu
                      onEdit={() => {
                        setSelectedPackage(pkg);
                        setOpenModal(true);
                      }}
                      onDelete={() => {
                        setDeleteId(pkg._id);
                        setConfirmOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide text-sm">
                    {pkg.destinations?.map((items, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 rounded-full px-3 py-1"
                      >
                        {items}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold">{pkg.packageName}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {pkg.overview?.Description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <Calendar className="w-4 h-4" />
                    {formatIndianDateTime(pkg.createdAt)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {pkg.days} Days / {pkg.nights} Nights
                  </p>
                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pkg.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {pkg.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Are you sure you want to delete this package?"
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

export default PackageSection;
