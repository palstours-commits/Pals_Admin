"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUpload from "../../../common/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubMenu,
  updateSubMenu,
  clearSubMenuError,
  clearSubMenuMessage,
} from "../../../store/slice/submenuSlice";
import { getMenus } from "../../../store/slice/menuSlice";
import { notifyAlert } from "../../../utils/notificationService";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const CreateSubMenu = ({ service, onClose }) => {
  const dispatch = useDispatch();

  const { menus } = useSelector((state) => state.menu);
  const { message, error } = useSelector((state) => state.submenu);

  const [form, setForm] = useState({
    menuId: service?.menuId || "",
    name: service?.name || "",
    slug: service?.slug || "",
    bannerImage: service?.bannerImage || null,
    status: service?.status || "Active",
  });

  useEffect(() => {
    dispatch(getMenus());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({
      ...prev,
      bannerImage: file,
    }));
  };

  const handleSave = () => {
    if (!form.menuId) {
      return alert("Please select a menu");
    }
    if (!form.name) {
      return alert("Submenu name is required");
    }

    const formData = new FormData();
    formData.append("menuId", form.menuId);
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("status", form.status);
    if (form.bannerImage) {
      formData.append("bannerImage", form.bannerImage);
    }

    if (service?._id) {
      dispatch(updateSubMenu({ id: service._id, data: formData }));
    } else {
      dispatch(createSubMenu(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "SubMenu Success",
        message,
        type: "success",
      });
      onClose();
      dispatch(clearSubMenuMessage());
    }

    if (error) {
      notifyAlert({
        title: "SubMenu Failed",
        message: error,
        type: "error",
      });
      dispatch(clearSubMenuError());
    }
  }, [message, error]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {service ? "Update SubMenu" : "Create SubMenu"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="flex justify-center">
            <ImageUpload
              size="1920x300"
              image={form.bannerImage}
              onImageChange={handleImageChange}
            />
          </div>
          <SingleSelectDropdown
            label="Select Menu *"
            options={menus}
            value={form.menuId}
            onChange={(val) => setForm((prev) => ({ ...prev, menuId: val }))}
            searchable
            labelKey="name"
            placeholder="Select a menu"
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              SubMenu Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={form.status === "Active"}
                  onChange={handleChange}
                  className="accent-green-700"
                />
                <span className="text-green-700 font-medium">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={form.status === "Inactive"}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                <span className="text-red-600 font-medium">Inactive</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4  bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition"
          >
            {service ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubMenu;
