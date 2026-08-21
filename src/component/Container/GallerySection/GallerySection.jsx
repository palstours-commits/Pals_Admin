"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Image as ImageIcon, Video } from "lucide-react";
import { getGallery, deleteGallery } from "../../../store/slice/gallerySlice";
import CreateGallery from "./CreateGallery";
import Image from "../../../common/Image";
import DotMenu from "../../../common/DotMenu";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";

const IMG_URL = import.meta.env.VITE_BASE_IMAGE_URL || "";

const Gallery = () => {
    const dispatch = useDispatch();

    const { galleries, loading, actionLoading } = useSelector(
        (state) => state.gallery
    );

    const [showCreate, setShowCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        dispatch(getGallery());
    }, [dispatch]);

    const getFileUrl = (item) =>
        item?.file ||
        item?.url ||
        item?.fileUrl ||
        item?.image ||
        item?.video ||
        item?.path ||
        "";

    const isVideo = (item) => {
        const url = getFileUrl(item);

        return (
            item?.type?.includes("video") ||
            item?.mimeType?.includes("video") ||
            /\.(mp4|webm|mov|avi|mkv)$/i.test(url)
        );
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            dispatch(deleteGallery(itemToDelete?._id || itemToDelete?.id));
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowCreate(true);
    };

    if (showCreate) {
        return (
            <CreateGallery
                onClose={() => {
                    setShowCreate(false);
                    setSelectedItem(null);
                    dispatch(getGallery());
                }}
                editData={selectedItem}
            />
        );
    }

    return (
        <div className="p-5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Gallery
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage gallery images and videos
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setSelectedItem(null);
                        setShowCreate(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                >
                    <Plus size={18} />
                    Add Gallery
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <p className="text-gray-500">
                        Loading gallery...
                    </p>
                </div>
            ) : galleries?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {galleries.map((item, index) => {
                        const url = getFileUrl(item);
                        const video = isVideo(item);

                        return (
                            <div
                                key={
                                    item?._id ||
                                    item?.id ||
                                    index
                                }
                                className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm group"
                            >
                                <div className="relative h-44 bg-gray-100">
                                    {video ? (
                                        <video
                                            src={IMG_URL + url}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={url}
                                            alt="Gallery"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 opacity-100 transition-opacity">
                                        <DotMenu
                                            onEdit={() => handleEdit(item)}
                                            onDelete={() => handleDeleteClick(item)}
                                        />
                                    </div>
                                </div>

                                <div className="p-3 flex items-center gap-2">
                                    {video ? (
                                        <Video
                                            size={16}
                                            className="text-red-500"
                                        />
                                    ) : (
                                        <ImageIcon
                                            size={16}
                                            className="text-red-500"
                                        />
                                    )}

                                    <span className="text-xs text-gray-600 truncate">
                                        {item?.name ||
                                            item?.fileName ||
                                            (video
                                                ? "Video"
                                                : "Image")}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="border border-dashed rounded-xl py-20 text-center">
                    <ImageIcon
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="font-semibold text-gray-600">
                        No Gallery Found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add your first gallery
                    </p>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Are you sure you want to delete this item?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={actionLoading}
            />
        </div>
    );
};

export default Gallery;