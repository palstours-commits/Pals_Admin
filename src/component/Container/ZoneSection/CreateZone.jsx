"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createZone,
  updateZone,
  clearZoneError,
  clearZoneMessage,
} from "../../../store/slice/zoneSlice";
import { getSubMenus } from "../../../store/slice/submenuSlice";
import ImageUpload from "../../../common/ImageUpload";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";
import { notifyAlert } from "../../../utils/notificationService";
import { Toggle } from "../../../common/Toggle";

const CreateZone = ({ zone, onClose }) => {
  const dispatch = useDispatch();
  const { submenus } = useSelector((state) => state.submenu);
  const { actionLoading, error, message } = useSelector((state) => state.zone);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subMenuId: "",
    description: "",
    image: null,
    istopdestination: false,
    istrending: false,
  });

  useEffect(() => {
    dispatch(getSubMenus());
  }, [dispatch]);

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || "",
        slug: zone.slug || "",
        subMenuId: zone.subMenuId?._id || "",
        description: zone.description || "",
        image: zone.image || null,
        istrending: zone?.istrending,
        istopdestination: zone?.istopdestination,
      });
    }
  }, [zone]);

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Success",
        message,
        type: "success",
      });
      dispatch(clearZoneMessage());
      onClose();
    }

    if (error) {
      notifyAlert({
        title: "Error",
        message: error,
        type: "error",
      });
      dispatch(clearZoneError());
    }
  }, [message, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("subMenuId", formData.subMenuId);
    payload.append("description", formData.description);
    payload.append("istrending", formData.istrending);
    payload.append("istopdestination", formData.istopdestination);
    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    if (zone?._id) {
      dispatch(updateZone({ id: zone._id, data: payload }));
    } else {
      dispatch(createZone(payload));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-6">
          {zone ? "Update Zone" : "Create Zone"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium mb-2">
            Image <span>*</span>
          </label>
          <div className="flex flex-col items-center">
            <ImageUpload
              image={formData.image}
              onImageChange={(file) =>
                setFormData({ ...formData, image: file })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-md border-gray-300 outline-0"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">SubMenu *</label>
            <SingleSelectDropdown
              options={submenus}
              value={formData.subMenuId}
              onChange={(value) =>
                setFormData({ ...formData, subMenuId: value })
              }
              placeholder="Select SubMenu"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border px-4 py-2 rounded-md outline-0 border-gray-300"
            />
          </div>
          <div className="space-y-4 flex justify-between">
            <Toggle
              label="Trending Zone"
              checked={formData.istrending}
              onChange={(value) =>
                setFormData({ ...formData, istrending: value })
              }
            />

            <Toggle
              label="Top Destination"
              checked={formData.istopdestination}
              onChange={(value) =>
                setFormData({ ...formData, istopdestination: value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 px-6   bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 border rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition cursor-pointer"
            >
              {actionLoading
                ? "Please wait..."
                : zone
                  ? "Update Zone"
                  : "Create Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateZone;
