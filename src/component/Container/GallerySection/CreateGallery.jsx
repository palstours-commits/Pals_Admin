"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, X } from "lucide-react";

import { createGallery, getGallery } from "../../../store/slice/gallerySlice";

const CreateGallery = ({ onClose, editData }) => {
    const dispatch = useDispatch();

    const { actionLoading } = useSelector(
        (state) => state.gallery
    );

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // If editing, populate with existing data
    useEffect(() => {
        if (editData) {
            // Handle edit mode - you might want to fetch the full item data
            // or display existing files
            console.log("Editing:", editData);
        }
    }, [editData]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) return;

        setFiles((prev) => [...prev, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video")
                ? "video"
                : "image",
        }));

        setPreviews((prev) => [
            ...prev,
            ...newPreviews,
        ]);
    };

    const removeFile = (index) => {
        setFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setPreviews((prev) => {
            const updated = [...prev];

            if (updated[index]?.url) {
                URL.revokeObjectURL(updated[index].url);
            }

            updated.splice(index, 1);

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files.length && !editData) return;

        const payload = new FormData();

        files.forEach((file) => {
            payload.append("files", file);
        });

        if (editData) {
            payload.append("id", editData._id || editData.id);
        }

        const result = await dispatch(
            createGallery(payload)
        );

        if (createGallery.fulfilled.match(result)) {
            onClose();
        }
    };

    const isEditing = !!editData;

    return (
        <div className="p-5">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">
                    {isEditing ? "Update Gallery" : "Create Gallery"}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    {isEditing ? "Update images and videos" : "Upload images and videos"}
                </p>
            </div>

            <div className="rounded-xl p-6">
                <label className="min-h-[220px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50/30 transition">
                    <Upload
                        size={40}
                        className="text-red-500 mb-3"
                    />
                    <p className="font-semibold text-gray-700">
                        Click to upload files
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Multiple images or videos allowed
                    </p>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {previews.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Selected Files ({files.length})
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {previews.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative border rounded-lg overflow-hidden"
                                >
                                    {item.type === "video" ? (
                                        <video
                                            src={item.url}
                                            controls
                                            className="w-full h-36 object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.file.name}
                                            className="w-full h-36 object-cover"
                                        />
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFile(index)
                                        }
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center"
                                    >
                                        <X size={15} />
                                    </button>

                                    <p className="text-xs truncate p-2">
                                        {item.file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border rounded-lg text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={
                            (!files.length && !isEditing) ||
                            actionLoading
                        }
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                        {actionLoading
                            ? "Uploading..."
                            : isEditing ? "Update" : "Create Gallery"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGallery;