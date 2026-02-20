"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  updateBlog,
  clearBlogError,
  clearBlogMessage,
} from "../../../store/slice/blogSlice";
import { notifyAlert } from "../../../utils/notificationService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "../../../common/Image";

const CreateBlog = ({ blogData, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, error, message } = useSelector((state) => state.blog);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    shortDescription: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: null,
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || "",
        slug: blogData.slug || "",
        category: blogData.category || "",
        shortDescription: blogData.shortDescription || "",
        description: blogData.description || "",
        metaTitle: blogData.metaTitle || "",
        metaDescription: blogData.metaDescription || "",
        featuredImage: null,
      });
      setImagePreview(blogData.featuredImage || null);
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setFormData((prev) => ({
        ...prev,
        title: value,
        slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImage = (file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      featuredImage: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleImage(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    if (blogData?._id) {
      dispatch(updateBlog({ id: blogData._id, data: payload }));
    } else {
      dispatch(createBlog(payload));
    }
  };

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearBlogMessage());
      onClose();
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearBlogError());
    }
  }, [message, error, dispatch, onClose]);

  return (
    <div className="m-6">
      <div className="p-8 max-w-5xl mx-auto bg-white rounded shadow">
        <h1
          className="text-2xl font-bold mb-6 cursor-pointer"
          onClick={onClose}
        >
          ← {blogData ? "Update Blog" : "Create Blog"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-md py-2 px-3 outline-0 border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                Category *
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-md py-2 px-3 outline-0  border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              rows={3}
              value={formData.shortDescription}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-3 outline-0  border-gray-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Description *
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
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
                setFormData((prev) => ({
                  ...prev,
                  description: editor.getData(),
                }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Featured Image *
            </label>

            <label
              onDragOver={handleDragOver}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-10
      flex flex-col items-center justify-center cursor-pointer transition
      ${isDragging ? "border-green-600 bg-green-50" : "border-gray-300"}
    `}
            >
              <span className="text-sm text-gray-500">
                Click or drag image here
              </span>
              <span className="text-xs text-gray-400 mt-1">
                (Only one image allowed)
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </label>
            {imagePreview && (
              <div className="mt-4 relative w-[150px] h-[150px] border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-black/60 text-white
        rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Meta Title</label>
            <input
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 outline-0  border-gray-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              rows={2}
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full border rounded-md p-3 outline-0  border-gray-300"
            />
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white rounded-lg"
            >
              {actionLoading ? "Please wait..." : "Save Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
