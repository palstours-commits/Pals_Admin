"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createPackage,
  updatePackage,
  clearPackageError,
  clearPackageMessage,
  deletePackageImage,
} from "../../../store/slice/packageSlice";
import { getZones } from "../../../store/slice/zoneSlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";
import { notifyAlert } from "../../../utils/notificationService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "../../../common/Image";
import ItineraryEditor from "../../../common/ItineraryEditor";

const CreatePackage = ({ packageData, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { zones } = useSelector((state) => state.zone);
  const { actionLoading, error, message } = useSelector(
    (state) => state.package,
  );
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedSubMenuId, setSelectedSubMenuId] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    zoneId: "",
    packageName: "",
    slug: "",
    destinations: "",
    days: "",
    nights: "",
    images: [],
    overview: "",
    tripHighlights: "",
    itinerary: [],
    importantInfo: "",
    isPopularDestinations: false,
    newArrivals: false,
    isTrending: false,
  });

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  useEffect(() => {
    if (packageData) {
      setFormData({
        zoneId: packageData?.zoneId?._id || "",
        packageName: packageData?.packageName || "",
        destinations: packageData?.destinations || "",
        days: packageData?.days || "",
        nights: packageData?.nights || "",
        images: [],
        slug: packageData?.slug || "",
        overview: packageData?.overview?.Description || "",
        tripHighlights: packageData?.tripHighlights || "",
        itinerary: packageData?.itinerary || [],
        importantInfo: packageData?.importantInfo || "",
        isPopularDestinations: packageData?.isPopularDestinations || false,
        newArrivals: packageData?.newArrivals || false,
        isTrending: packageData?.isTrending || false,
      });
      setExistingImages(packageData?.images || []);
      if (packageData?.zoneId?.subMenuId?._id) {
        setSelectedSubMenuId(packageData.zoneId.subMenuId._id);
      }
    }
  }, [packageData]);

  const subMenus = [
    ...new Map(zones?.map((z) => [z?.subMenuId?._id, z?.subMenuId])).values(),
  ];

  const filteredZones = selectedSubMenuId
    ? zones?.filter((z) => z?.subMenuId?._id === selectedSubMenuId)
    : [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "packageName") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setFormData({
        ...formData,
        packageName: value,
        slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImages = (files) => {
    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const removeExistingImage = (image) => {
    if (!packageData?._id) return;
    dispatch(
      deletePackageImage({
        packageId: packageData._id,
        image,
      }),
    );
    setExistingImages((prev) => prev.filter((img) => img !== image));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImages(files);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => payload.append("images", img));
      } else if (key === "itinerary") {
        payload.append("itinerary", JSON.stringify(value));
      } else {
        payload.append(key, value);
      }
    });

    if (packageData) {
      dispatch(
        updatePackage({
          id: packageData._id,
          data: payload,
        }),
      );
    } else {
      dispatch(createPackage(payload));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearPackageMessage());
      onClose();
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearPackageError());
    }
  }, [message, error, dispatch, navigate]);

  return (
    <div className="m-6">
      <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow ">
        <h1
          className="text-2xl font-bold mb-6 pb-4 cursor-pointer"
          onClick={onClose}
        >
          ← {packageData ? "Update Package" : "Create Package"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Holiday Type *
                </label>

                <SingleSelectDropdown
                  options={subMenus}
                  value={selectedSubMenuId}
                  onChange={(value) => {
                    setSelectedSubMenuId(value);
                    setFormData({ ...formData, zoneId: "" });
                  }}
                  placeholder="Select Holiday Type"
                  labelKey="name"
                  valueKey="_id"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Zone *</label>
                <SingleSelectDropdown
                  options={filteredZones}
                  value={formData.zoneId}
                  onChange={(value) =>
                    setFormData({ ...formData, zoneId: value })
                  }
                  placeholder={
                    selectedSubMenuId
                      ? "Select Zone"
                      : "Select Holiday Type First"
                  }
                  disabled={!selectedSubMenuId}
                  labelKey="name"
                  valueKey="_id"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  packageName *
                </label>
                <input
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className=" py-2 border-gray-300 rounded-md border w-full outline-0 ps-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Destinations *
                </label>
                <input
                  name="destinations"
                  value={formData.destinations}
                  onChange={handleChange}
                  className=" py-2 border-gray-300 rounded-md border w-full outline-0 ps-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Days *
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleChange}
                    className=" py-2 border-gray-300 rounded-md border w-full outline-0 ps-2"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Nights *
                  </label>
                  <input
                    type="number"
                    name="nights"
                    value={formData.nights}
                    onChange={handleChange}
                    className=" py-2 border-gray-300 rounded-md border w-full outline-0 ps-2"
                    required
                  />
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 space-y-3 flex justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPopularDestinations"
                    checked={formData.isPopularDestinations}
                    onChange={handleChange}
                  />
                  Popular Destination
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="newArrivals"
                    checked={formData.newArrivals}
                    onChange={handleChange}
                  />
                  New Arrival
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleChange}
                  />
                  Trending
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Package Images
                </label>
                <label
                  onDragOver={handleDragOver}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-15
    flex flex-col items-center justify-center cursor-pointer
    transition
    ${isDragging ? "border-green-600 bg-green-50" : "border-gray-300"}
  `}
                >
                  <span className="text-sm text-gray-500">
                    Click or drag images here
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    (Multiple images allowed)
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImages(e.target.files)}
                  />
                </label>
                {imagePreviews?.length > 0 && (
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide ">
                    {imagePreviews?.map((img, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-300 rounded-lg 
                   overflow-hidden w-[100px] h-[100px] shrink-0"
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white  cursor-pointer
                     rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {existingImages?.length > 0 && (
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {existingImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-300 rounded-lg 
                   overflow-hidden w-[100px] h-[100px] shrink-0"
                      >
                        <Image
                          src={img}
                          alt="existing"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeExistingImage(img)}
                          className="absolute top-1 right-1 bg-black/60 text-white
                     rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Overview
                </label>
                <textarea
                  name="overview"
                  rows={3}
                  value={formData.overview}
                  onChange={handleChange}
                  className="textarea border border-gray-300 rounded-lg p-4 space-y-3 w-full outline-0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Trip Highlights
                </label>
                <CKEditor
                  key={packageData?._id || "new"}
                  editor={ClassicEditor}
                  data={formData.tripHighlights}
                  config={{
                    licenseKey: "GPL",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "link",
                      "|",
                      "undo",
                      "redo",
                    ],
                  }}
                  onChange={(e, editor) =>
                    setFormData({
                      ...formData,
                      tripHighlights: editor.getData(),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Itinerary
                </label>

                <ItineraryEditor
                  value={formData.itinerary}
                  onChange={(value) =>
                    setFormData({ ...formData, itinerary: value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Important Information
                </label>
                <CKEditor
                  key={packageData?._id || "new"}
                  editor={ClassicEditor}
                  data={formData.importantInfo}
                  config={{
                    licenseKey: "GPL",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "link",
                      "|",
                      "undo",
                      "redo",
                    ],
                  }}
                  onChange={(e, editor) =>
                    setFormData({
                      ...formData,
                      importantInfo: editor.getData(),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              {actionLoading ? "Please wait..." : "Save Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackage;
