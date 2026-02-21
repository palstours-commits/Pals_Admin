"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOffer,
  updateOffer,
  clearOfferError,
  clearOfferMessage,
  getOfferCategories,
} from "../../../store/slice/offerSlice";
import { getZones } from "../../../store/slice/zoneSlice";
import { getPackages } from "../../../store/slice/packageSlice";
import { notifyAlert } from "../../../utils/notificationService";

const CreateOffer = ({ offerData, onClose }) => {
  const dispatch = useDispatch();

  const { actionLoading, message, error, categories } = useSelector(
    (state) => state.offer,
  );
  const { zones } = useSelector((state) => state.zone);
  const { packages } = useSelector((state) => state.package);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    offerCategory: "",
    offerName: "",
    offerType: "zone",
    zoneId: "",
    packageId: "",
    offerPercentage: "",
    description: "",
    validFrom: "",
    validTo: "",
  });

  useEffect(() => {
    dispatch(getOfferCategories());
    dispatch(getZones());
    dispatch(getPackages());
  }, [dispatch]);

  useEffect(() => {
    if (offerData) {
      setFormData({
        offerCategory: offerData.offerCategory || "",
        offerName: offerData.offerName || "",
        offerType: offerData.offerType || "zone",
        zoneId: offerData.zoneId?._id || "",
        packageId: offerData.packageId?._id || "",
        offerPercentage: offerData.offerPercentage || "",
        description: offerData.description || "",
        validFrom: offerData.validFrom ? offerData.validFrom.split("T")[0] : "",
        validTo: offerData.validTo ? offerData.validTo.split("T")[0] : "",
      });
    }
  }, [offerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
    };
    if (payload.offerType === "zone") {
      delete payload.packageId;
    }

    if (payload.offerType === "package") {
      delete payload.zoneId;
    }
    if (offerData) {
      dispatch(updateOffer({ id: offerData._id, data: payload }));
    } else {
      dispatch(createOffer(payload));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearOfferMessage());
      onClose();
    }
    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearOfferError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 cursor-pointer" onClick={onClose}>
        ← {offerData ? "Update Offer" : "Create Offer"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm  text-gray-600">Offer Name</label>
            <input
              name="offerName"
              value={formData.offerName}
              onChange={handleChange}
              placeholder="Offer Name"
              required
              className="w-full border border-gray-300 p-2 rounded outline-0"
            />
          </div>
          <div>
            <label className="text-sm">Offer Category</label>

            <select
              value={isNewCategory ? "new" : formData.offerCategory}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setIsNewCategory(true);
                  setFormData((prev) => ({ ...prev, offerCategory: "" }));
                } else {
                  setIsNewCategory(false);
                  setNewCategory("");
                  setFormData((prev) => ({
                    ...prev,
                    offerCategory: e.target.value,
                  }));
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required={!isNewCategory}
            >
              <option value="">Select Offer Category</option>

              {categories?.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}

              <option value="new">+ Add New Category</option>
            </select>

            {isNewCategory && (
              <input
                type="text"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    offerCategory: e.target.value,
                  }));
                }}
                className="mt-2 w-full border border-gray-300 p-2 rounded outline-0"
                required
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Offer Type</label>
            <select
              name="offerType"
              value={formData.offerType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  offerType: e.target.value,
                  zoneId: "",
                  packageId: "",
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
            >
              <option value="zone">Zone Offer</option>
              <option value="package">Package Offer</option>
            </select>
          </div>
          {formData.offerType === "zone" ? (
            <div>
              <label className="text-sm text-gray-600">Select Zone</label>
              <select
                value={formData.zoneId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    zoneId: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
                required
              >
                <option value="">Select Zone</option>
                {zones?.map((z) => (
                  <option key={z._id} value={z._id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-sm text-gray-600">Select Package</label>
              <select
                value={formData.packageId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    packageId: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-0"
                required
              >
                <option value="">Select Package</option>
                {packages?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.packageName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Discount (%)</label>
            <input
              type="number"
              name="offerPercentage"
              value={formData.offerPercentage}
              onChange={handleChange}
              placeholder="Discount %"
              required
              className="w-full border border-gray-300 p-2 rounded outline-0"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Validity</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded outline-0"
                required
              />
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded outline-0"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Offer Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Offer Description"
            rows={3}
            className="w-full border border-gray-300 p-2 rounded outline-0"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-800 text-white px-6 py-2 rounded"
          >
            {actionLoading ? "Saving..." : "Save Offer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOffer;
