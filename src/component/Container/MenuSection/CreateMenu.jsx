import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUpload from "../../../common/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMenuError,
  clearMenuMessage,
  createMenu,
  updateMenu,
} from "../../../store/slice/menuSlice";
import { notifyAlert } from "../../../utils/notificationService";

const ServiceStatusModal = ({ service, onClose }) => {
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.menu);
  const [form, setForm] = useState({
    name: service?.name || "",
    slug: service?.slug || "",
    image: service?.image || null,
    status: service?.status || "Active",
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || "",
        slug: service.slug || "",
        image: service.imagePath || null,
        status: service.status || "Active",
      });
    }
  }, [service]);

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
      image: file,
    }));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }
    if (service?._id) {
      dispatch(updateMenu({ id: service._id, data: formData }));
    } else {
      dispatch(createMenu(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Menu Success",
        message,
        type: "success",
      });
      onClose();
      dispatch(clearMenuMessage());
    }

    if (error) {
      notifyAlert({
        title: "Menu Failed",
        message: error,
        type: "error",
      });
      dispatch(clearMenuError());
    }
  }, [message, error]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-sm shadow-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">
            {service ? "Update Menu" : "Create Menu"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="flex justify-center">
            <ImageUpload image={form.image} onImageChange={handleImageChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md 
                         focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 transition cursor-pointer"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusModal;
