import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUpload from "../../../common/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  clearIconError,
  clearIconMessage,
  createIcon,
  updateIcon,
} from "../../../store/slice/iconSlice";
import { notifyAlert } from "../../../utils/notificationService";

const CreateIcon = ({ icon, onClose }) => {
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.icon);

  const [form, setForm] = useState({
    name: icon?.name || "",
    slug: icon?.slug || "",
    image: icon?.imagePath || null,
    status: icon?.status || "Active",
  });

  useEffect(() => {
    if (icon) {
      setForm({
        name: icon.name || "",
        slug: icon.slug || "",
        image: icon.imagePath || null,
        status: icon.status || "Active",
      });
    }
  }, [icon]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({ ...prev, name: value, slug }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (icon?._id) {
      dispatch(updateIcon({ id: icon._id, data: formData }));
    } else {
      dispatch(createIcon(formData));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Icon Success",
        message,
        type: "success",
      });
      onClose();
      dispatch(clearIconMessage());
    }

    if (error) {
      notifyAlert({
        title: "Icon Failed",
        message: error,
        type: "error",
      });
      dispatch(clearIconError());
    }
  }, [message, error]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-sm shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {icon ? "Update Icon" : "Create Icon"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
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
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-800 text-white rounded-md"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIcon;
