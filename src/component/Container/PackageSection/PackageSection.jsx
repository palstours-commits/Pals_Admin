import { Calendar, LayoutGrid, List } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "../../../common/Image";
import DotMenu from "../../../common/DotMenu";
import CreatePackage from "./CreatePackage";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { notifyAlert } from "../../../utils/notificationService";
import { formatIndianDateTime } from "../../../utils/formatDateTime";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid");

  const filteredPackages = packages?.filter((pkg) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      pkg?.packageName?.toLowerCase().includes(search) ||
      pkg?.zoneId?.name?.toLowerCase().includes(search) ||
      pkg?.zoneId?.subMenuId?.name?.toLowerCase().includes(search) ||
      pkg?.destinations?.some((d) => d.toLowerCase().includes(search)) ||
      (search === "active" && pkg?.status === 1) ||
      (search === "inactive" && pkg?.status === 0)
    );
  });

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
          <div className="flex justify-between items-center mb-6 px-10">
            <h2 className="text-xl font-bold">
              Package List ({packages?.length || 0})
            </h2>

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
                + Create Package
              </button>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewType("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                    viewType === "grid"
                      ? "bg-green-800 text-white shadow"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewType("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                    viewType === "list"
                      ? "bg-green-800 text-white shadow"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-8">
              {filteredPackages?.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden "
                >
                  <Link to={`/package/${pkg?._id}`}>
                    <div className="relative h-56">
                      <Image
                        src={pkg.images?.[0]}
                        alt={pkg.packageName}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 "
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-red-600 font-semibold">
                        {pkg.zoneId?.subMenuId?.name}
                        {pkg.zoneId?.subMenuId?.name &&
                          pkg.zoneId?.name &&
                          " / "}
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
          ) : (
            <div className="p-6 space-y-4">
              {filteredPackages?.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-lg shadow flex gap-4 p-4 items-center"
                >
                  <Link
                    to={`/package/${pkg?._id}`}
                    className="w-40 h-28 shrink-0"
                  >
                    <Image
                      src={pkg.images?.[0]}
                      alt={pkg.packageName}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">
                        {pkg.packageName}
                      </h3>
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
                    <p className="text-sm text-gray-500">
                      {pkg.zoneId?.subMenuId?.name} / {pkg.zoneId?.name}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {pkg.overview?.Description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        {pkg.days} Days / {pkg.nights} Nights
                      </span>
                      <span>{formatIndianDateTime(pkg.createdAt)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
          )}
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
