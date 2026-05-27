"use client";

import { X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createZone,
  updateZone,
  clearZoneError,
  clearZoneMessage,
} from "../../../store/slice/zoneSlice";
import { getSubMenus } from "../../../store/slice/submenuSlice";
import ImageUpload from "../../../common/ImageUpload";
import { notifyAlert } from "../../../utils/notificationService";
import { Toggle } from "../../../common/Toggle";

const CreateZone = ({ zone, onClose }) => {
  const dispatch = useDispatch();

  const { submenus = [] } = useSelector((state) => state.submenu);

  const { actionLoading, error, message } = useSelector(
    (state) => state.zone,
  );

  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    menuId: "",
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
        menuId: zone.menuId?.slug || "",
        description: zone.description || "",
        image: zone.image || null,
        istrending: zone?.istrending || false,
        istopdestination: zone?.istopdestination || false,
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
  }, [message, error, dispatch, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      setFormData({
        ...formData,
        name: value,
        slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("menuId", formData.menuId);
    payload.append("description", formData.description);
    payload.append("istrending", formData.istrending);
    payload.append("istopdestination", formData.istopdestination);

    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    if (zone?._id) {
      dispatch(
        updateZone({
          id: zone._id,
          data: payload,
        }),
      );
    } else {
      dispatch(createZone(payload));
    }
  };

  const selectedMenu = submenus.find(
    (menu) => menu.slug === formData.menuId,
  );

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
                setFormData({
                  ...formData,
                  image: file,
                })
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
            <label className="text-sm font-medium">Menu *</label>

            <div className="relative mt-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between bg-white"
              >
                <span className="text-left">
                  {selectedMenu?.name || "Select Menu"}
                </span>

                <ChevronDown size={18} />
              </button>

              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {submenus.length > 0 ? (
                    submenus.map((menu) => (
                      <button
                        type="button"
                        key={menu._id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            menuId: menu._id,
                          });

                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                      >
                        {menu.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No results
                    </div>
                  )}
                </div>
              )}
            </div>
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
                setFormData({
                  ...formData,
                  istrending: value,
                })
              }
            />

            <Toggle
              label="Top Destination"
              checked={formData.istopdestination}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  istopdestination: value,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 px-6 bg-gray-50">
            <button
              type="button"
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